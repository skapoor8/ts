#!/bin/bash

# resource names ---------------------------------------------------------------
RG_NAME='rg-cats'
COSMOS_NAME='cosmos-skapoor-cats'
STORAGE_NAME='stoskapoorcats'
FUNC_NAME='func-cats-api'
RESOURCE_LOCATION='eastus'

# color codes ------------------------------------------------------------------
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# accept args ------------------------------------------------------------------
path=''
while getopts 'p:' flag; do
    case "${flag}" in
    p) path="${OPTARG}" ;;
    esac
done

printf "${BLUE}Checking if user is logged in... ${NC}\n" # ---------------------
if [[ $(az account show) ]]; then
    printf "${GREEN}Success${NC}\n\n"
else
    printf "${RED}User is not logged in. Please log in with 'az login'. ${NC}\n\n"
    exit 1
fi

printf "${BLUE}Creating resource group... ${NC}\n"
{
    az group create --name $RG_NAME --location $RESOURCE_LOCATION
    printf "${GREEN}Success${NC}\n\n"
} || {
    printf "${RED}Failed${NC}\n\n"
    exit 1
}

printf "${BLUE}Creating cosmos db...${NC}\n" # ---------------------------------
{
    printf "${BLUE}Checking name availability / if instance already exists...${NC}\n"
    NOT_AVAILABLE=$(az cosmosdb check-name-exists --name $COSMOS_NAME)
    COSMOS_ALREADY_MADE_QUERY=$(az cosmosdb list --query "[?name=='$COSMOS_NAME'].name")

    if [[ "$COSMOS_ALREADY_MADE_QUERY" == *"$COSMOS_NAME"* ]]; then
        printf "${YELLOW}%b${NC}" 'Cosmos instance already exists. Ensure ' \
            'this is okay. The instance may have been created by a prior run of ' \
            'this script, or this may be a legitimate naming conflict.\n\n'
    elif [[ $NOT_AVAILABLE =~ "false" ]]; then
        printf "${GREEN}Name available${NC}\n"
        az cosmosdb create -g $RG_NAME -n $COSMOS_NAME --locations \
            regionName=$RESOURCE_LOCATION --capabilities EnableServerless
        printf "${GREEN}Success${NC}\n\n"
    else
        printf "${RED}Name not available${NC}\n"
        false
    fi
} || {
    printf "${RED}Failed. Run infrastructure/destroy.sh to tear down existing resources.${NC}\n\n"
    exit 1
}

printf "${BLUE}Creating storage account for function app... ${NC}\n" # ---------
{
    printf "${BLUE}Checking name availability...${NC}\n"
    AVAILABLE=$(az storage account check-name --name $STORAGE_NAME --query "nameAvailable")
    AZ_STORAGE_QUERY=$(az storage account list --query "[?name=='$STORAGE_NAME'].name")

    #check if name is available
    if [[ $AVAILABLE =~ "true" ]]; then
        printf "${GREEN}Name available"
        az storage account create --name $STORAGE_NAME --location $RESOURCE_LOCATION \
            --resource-group $RG_NAME --sku Standard_LRS
        printf "${GREEN}Success${NC}\n\n"
    # check if already exits
    elif [[ "$AZ_STORAGE_QUERY" == *"$STORAGE_NAME"* ]]; then
        printf "${YELLOW}%b${NC}" 'Storage account already exists. Ensure this is ' \
            'okay. A storage account may exist since teardown scripts may not be ' \
            'deleting storage account resources due to the global unique name ' \
            "requirement. Or this may be a legitimate name conflict\n\n"
    else
        printf "${RED}Name not available${NC}\n"
        false
    fi
} || {
    printf "${RED}Failed. Run infrastructure/destroy.sh to tear down existing resources.${NC}\n\n"
    exit 1
}

printf "${BLUE}Creating function app... ${NC}\n" #------------------------------
{
    result=$(az functionapp create --resource-group $RG_NAME \
        --consumption-plan-location $RESOURCE_LOCATION --runtime node --runtime-version 16 \
        --functions-version 4 --name $FUNC_NAME \
        --storage-account $STORAGE_NAME)
    if [[ "$result" == *"already exists"* ]]; then
        printf "${RED}Name not available${NC}\n"
        false
    else
        printf "${GREEN}Success${NC}\n\n"
    fi
} || {
    printf "${RED}Failed. Run infrastructure/destroy.sh to tear down existing resources.${NC}\n\n"
    exit 1
}

printf "${BLUE}Adding environment variables to function app, and create env file... ${NC}\n" #-------
{
    DB_NAME="CatsDatabase"
    COSMOS_ENDPOINT=$(az cosmosdb show -n $COSMOS_NAME -g $RG_NAME --query "documentEndpoint" | tr -d '"')
    COSMOS_KEY=$(az cosmosdb keys list --name $COSMOS_NAME --resource-group $RG_NAME --query primaryMasterKey | tr -d '"')

    az functionapp config appsettings set --name $FUNC_NAME -g $RG_NAME \
        --settings "AZURE_COSMOS_DB_NAME=$DB_NAME" \
        "AZURE_COSMOS_DB_ENDPOINT=$COSMOS_ENDPOINT" \
        "AZURE_COSMOS_DB_KEY=$COSMOS_KEY"

    if [ $path ]; then
        printf "${BLUE}Creating .cosmos.env file in the specified path: $path ${NC}\n"
        echo "AZURE_COSMOS_DB_NAME=$DB_NAME" >"$path/.cosmos.env"
        echo "AZURE_COSMOS_DB_ENDPOINT=$COSMOS_ENDPOINT" >>"$path/.cosmos.env"
        echo "AZURE_COSMOS_DB_KEY=$COSMOS_KEY" >>"$path/.cosmos.env"
    else
        printf "${YELLOW}No env file path created. Re-run script with -p flag to create an .env file with your cosmos env connection variables ${NC}\n"
    fi
} || {
    printf "${RED}Failed. Run infrastructure/destroy.sh to tear down existing resources.${NC}\n\n"
    exit 1
}

printf "${GREEN}Infrastructure creation complete. Push to git (branch main-azure-function-deployment) to deploy your project! ${NC}\n"
