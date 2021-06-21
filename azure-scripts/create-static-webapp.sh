resourcegroup="rg-sourcemanager-001"
location="westus2"
githubrepourl=""
branch="main"
githubtoken=""

az staticwebapp create \
    --name="sourcemanagerui" \
    --resource-group $resourcegroup \
    --location $location \
    --source $githubrepourl \
    --branch $branch \
    --app-location "/" \
    --api-location "" \
    --output-location "build" \
    --token $githubtoken \
    --tags "Accounting=GMR" "Owner=GMR IT" "CreatedBy=Shawn Brown"

# az staticwebapp hostname set --name sourcemanagerui --hostname sourcemanager.globalmusicrights.com

# az webapp auth update -g $resourcegroup -n sourcemanagerui --enabled true \
#     --action LoginWithAzureActiveDirectory \
#     --aad-allowed-token-audiences https://webapp_name.azurewebsites.net/.auth/login/aad/callback \
#     --aad-client-id GUID \
#     --aad-client-secret very_secured_password \
#     --aad-token-issuer-url https://sts.windows.net/GUID