# todo: could be worth checking is user has ssh-added their identities

printf "${BLUE}Creating deployment pipeline with github actions... ${NC}\n" #---
{
    printf "${BLUE}Checking branch main-azure-function-deployment exists... ${NC}\n"
    # bash: check if cmd outputs string. this is not working...
    if [[ $(git ls-remote --heads git@github.com:skapoor8/ts.git main-azure-function-deployment) ]]; then
        printf "${GREEN}Branch exists${NC}\n"
    else
        printf "${Blue}Branch does not exist. Creating..."
        {
            git checkout -b main-azure-function-deployment &&
                git push origin main-azure-function-deployment &&
                git checkout main
        } || {
            git checkout main
            printf "${RED}Error creating branch${NC}\n"
            false
        }
    fi

    printf "${BLUE}Setting SCM_DO_BUILD_DURING_DEPLOYMENT=true in function app settings${NC}\n"
    # setting SCM_DO_BUILD_DURING_DEPLOYMENT to true, otherwise github action fails
    az functionapp config appsettings set --name func-skapoor-test1-api \
        --resource-group rg-test-1 --settings "SCM_DO_BUILD_DURING_DEPLOYMENT=true"

    printf "${BLUE}Creating github action. You will be prompted for your passphrase...${NC}\n"
    az functionapp deployment github-actions add --repo "https://github.com/skapoor8/ts" \
        -g rg-test-1 -n func-skapoor-test1-api --login-with-github \
        --build-path ./nest-js/azure-function-deployment -b main-azure-function-deployment
    printf "${GREEN}Success. Edit your workflow file to give it a more readable name (recommended).${NC}\n\n"
} || {
    printf "${RED}Failed. Run infrastructure/destroy.sh to tear down existing resources.${NC}\n\n"
    exit 1
}
