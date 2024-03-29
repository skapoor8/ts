#!/bin/bash

# color codes
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

printf "${BLUE}Checking if user is logged in... ${NC}\n"
if [[ $(az account show) ]]
then
  printf "${GREEN}Success${NC}\n\n"
else
  printf "${RED}User is not logged in. Please log in with 'az login'. ${NC}\n\n"
  exit 1
fi

printf "${BLUE}Destroying deployment pipeline with github actions... ${NC}\n"
{
  az functionapp deployment github-actions remove --repo "https://github.com/skapoor8/ts" \
	-g rg-test-1 -n func-skapoor-test1-api --login-with-github \
	-b main-azure-function-deployment
} || {
  printf "${RED}Failed${NC}\n\n"
  exit 1
}

printf "${BLUE}Destroying resource group rg-test... ${NC}\n"
{
  az group delete --name rg-test-1 -y
  printf "${GREEN}Success${NC}\n\n"
} || {
  printf "${RED}Failed${NC}\n\n"
}

printf "${GREEN}Infrastructure teardown complete${NC}\n"