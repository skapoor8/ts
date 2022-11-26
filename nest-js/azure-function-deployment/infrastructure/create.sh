#!/bin/bash

# color codes
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

printf "${BLUE}Checking if user is logged in... ${NC}\n"
if [[ $(az account show) ]]
then
	printf "${GREEN}Success${NC}\n\n"
else
	printf "${RED}User is not logged in. Please log in with 'az login'. ${NC}\n\n"
	exit 1
fi

printf "${BLUE}Creating resource group rg-test... ${NC}\n"
{
	az group create --name rg-test-1 --location "East US"
	printf "${GREEN}Success${NC}\n\n"
} || {
	printf "${RED}Failed${NC}\n\n"
	exit 1
}

printf "${BLUE}Creating storage account for function app... ${NC}\n"
{
	printf "${BLUE}Checking name availability...${NC}\n"
	AVAILABLE=$(az storage account check-name --name stoskapoortest1 --query "nameAvailable")
	AZ_STORAGE_QUERY=$(az storage account list --query "[?name=='stoskapoortest1'].name")

	#check if name is available
	if [[ $AVAILABLE =~ "true" ]]
	then
		printf "${GREEN}Name available"
		az storage account create --name stoskapoortest1 --location "East US" \
		--resource-group rg-test-1 --sku Standard_LRS
		printf "${GREEN}Success${NC}\n\n"
	# check if already exits
	elif [[ "$AZ_STORAGE_QUERY" == *'stoskapoortest1'* ]]
	then
		printf "${YELLOW}%b${NC}" 'Storage account already exists. Ensure this is ' \
		'okay. A storage account may exist since teardown scripts may not be ' \
		'deleting storage account resources due to the global unique name ' \
		"requirement. Or this may be a legitimate name conflict\n\n"
	else 
		printf "${RED}Name not available${NC}\n"
		false
	fi
} || {
	printf "${RED}Failed. Run ./destroy to tear down existing resources.${NC}\n\n"
	exit 1
}

printf "${BLUE}Creating function app... ${NC}\n"
{
  result=$(az functionapp create --resource-group rg-test-1 \
	--consumption-plan-location eastus --runtime node --runtime-version 16 \
	--functions-version 4 --name func-skapoor-test1-api \
	--storage-account stoskapoortest1)
	if [[ "$result" == *"already exists"* ]]
	then
		printf "${RED}Name not available${NC}\n"
		false
	else
		printf "${GREEN}Success${NC}\n\n"
	fi
} || {
  printf "${RED}Failed${NC}\n\n"
}

# todo: could be worth checking is user has ssh-added their identities

printf "${BLUE}Creating deployment pipeline with github actions... ${NC}\n"
{
	printf "${BLUE}Checking branch main-azure-function-deployment exists... ${NC}\n"
	# bash: check if cmd outputs string. this is not working...
	if [[ $(git ls-remote --heads git@github.com:skapoor8/ts.git  main-azure-function-deployment) ]]
	then
		printf "${GREEN}Branch exists${NC}\n"
	else 
		printf "${Blue}Branch does not exist. Creating..."
		{
			git checkout -b main-azure-function-deployment \
			&& git push origin main-azure-function-deployment \
			&& git checkout main
		} || {
			git checkout main
			printf "${RED}Error creating branch${NC}\n"
			false
		}
	fi

	printf "${BLUE}Creating github action. You may be prompted for your passphrase...${NC}\n"
	az functionapp deployment github-actions add --repo "https://github.com/skapoor8/ts" \
	-g rg-test-1 -n func-skapoor-test1-api --login-with-github \
	--build-path ./nest-js/azure-function-deployment -b main-azure-function-deployment
	printf "${GREEN}Success${NC}\n\n"
} || {
	printf "${RED}Failed${NC}\n\n"
}

printf "${GREEN}Infrastructure creation complete. Push to git to deploy your project! ${NC}\n"