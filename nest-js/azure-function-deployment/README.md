# Deployment with Azure CLI

## Creating resource groups

```bash
az group create --name rg-test-1 --location "East US"
```

### Pitfalls

- name should be unique within your resource groups
- location should be valid and make sense for your project

## Creating function apps

1. Create a storage account for function app (this is where function app code is stored)

```bash
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
```

2. Create function app

### Pitfalls

- Storage accounts require globals names. It's possible to check for storage account name availability with `az storage account check-name --name "some name"`. Take advantage of this.
- Function apps's also require globals names, however it's not possible to check for name availability for them. Make sure to scope your function app names to projects and users, and handle possible failures do to names not being available.

## Creating deployment pipelines for function apps w/ GitHub Actions

1. Check that the trigger branch exists, if not create it
2. Set SCM_DO_BUILD_DURING_DEPLOYMENT=true for function app pipelines (or WEBSITE_WEBDEPLOY_USE_SCM=true for app service pipelines) in config settings
3. Use `az functionapp deployment github-actions add` to automatically set up a ci-cd pipeline. This will create github action on the specified branch (not main) and configure secrets in github (add publish-keys from your function app) to allow the github action to authenticate and push to your protected azure resource.

```bash
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

	printf "${BLUE}Setting SCM_DO_BUILD_DURING_DEPLOYMENT=true in function app settings${NC}\n"
	# setting SCM_DO_BUILD_DURING_DEPLOYMENT to true, otherwise github action fails
	az functionapp config appsettings set --name func-skapoor-test1-api \
	--resource-group rg-test-1 --settings "SCM_DO_BUILD_DURING_DEPLOYMENT=true" \

	printf "${BLUE}Creating github action. You will be prompted for your passphrase...${NC}\n"
	az functionapp deployment github-actions add --repo "https://github.com/skapoor8/ts" \
	-g rg-test-1 -n func-skapoor-test1-api --login-with-github \
	--build-path ./nest-js/azure-function-deployment -b main-azure-function-deployment
	printf "${GREEN}Success${NC}\n\n"
} || {
	printf "${RED}Failed${NC}\n\n"
}
```

### Pitfalls

1. The auto-generated pipeline will fail without setting the appropriate config variables. Read more about (Failed to deploy errors - invocation exceotion)[https://stackoverflow.com/questions/74195407/unable-to-deploy-fresh-azure-function-to-linux-app]

## Resources

1. (Azure CLI Reference)[https://learn.microsoft.com/en-us/cli/azure/?view=azure-cli-latest]
