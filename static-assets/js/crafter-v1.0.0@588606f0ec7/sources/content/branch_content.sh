#!/bin/bash
#
# This script will transition to a test git branch for working with sample content
#


script_dir="$(dirname "$0")"
site_id="$(pwd -P "${script_dir}" | sed 's:.*/repos/sites/\([^/]*\)/sandbox.*:\1:')"

branch='testing'
printf "Enter the name of the git branch you would like to work on [default $branch]: "
read response
if [[ ${#response} -gt 0 ]]; then
    branch="$response"
fi

host='localhost'
port='8080'
printf "Enter your $host Crafter Studio port [default $port]: "
read response
if [[ ${#response} -gt 0 ]]; then
    port="$response"
fi

pw='admin'
printf "Enter your Crafter Studio admin password [default $pw]: "
read -s response
if [[ ${#response} -gt 0 ]]; then
    pw="$response"
fi

cookie="/var/tmp/crafter-studio-cookie.txt"
[[ -f "$cookie" ]] && rm "$cookie"
echo -e "\n\nLogging into Crafter Studio..."
login="$(curl -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"$pw\"}" -c "$cookie" -b "XSRF-TOKEN=A_VALUE" -H "X-XSRF-TOKEN:A_VALUE" -X POST -s "http://${host}:${port}/studio/api/1/services/api/1/security/login.json")"
echo -e "$login\n"
if [[ $(echo "$login" | grep -c -e "username" -e "admin") -le 0 ]]; then
    echo "Unable to login to Crafter Studio!"
    exit 1
fi

if [[ $(git branch --list | grep -c "$branch") -gt 0 ]]; then
    printf "A branch named $branch already exists. Would you like to continue and overwrite this branch? [Yn]: "
    read response
    if [[ $(echo "$response" | grep -ic '^n') -gt 0 ]]; then
        exit 0
    fi
    if [[ $(git status | grep -c "branch $branch") -gt 0 ]]; then
        echo "You have the $branch branch presently checked out. Please switch to the branch with your code first and then you may rerun this script."
        exit 1
    fi
    echo "Removing previous branch $branch..."
    git branch -D "$branch"
fi

echo "Creating $branch branch..."
git checkout -b "$branch"
if [[ $? -ne 0 ]]; then
    echo "Unable to switch to branch $branch!"
    exit 1
fi

echo -e "\nPlacing content..."
"${script_dir}/copy_content.sh"
if [[ $? -ne 0 ]]; then
    echo "Unable to place sample content!"
    exit 1
fi

echo -e "\nCommitting content..."
git add -A && git commit -a -m "adding sample content"
if [[ $? -ne 0 ]]; then
    echo "Unable to commit sample content!"
    exit 1
fi

echo -e "\nSynching Crafter..."
curl -H "Content-Type: application/json" -b "$cookie" -b "XSRF-TOKEN=A_VALUE" -H "X-XSRF-TOKEN:A_VALUE" -X POST -d "{\"site_id\":\"${site_id}\"}" "http://${host}:${port}/studio/api/1/services/api/1/repo/sync-from-repo.json"
echo

echo -e "\nUpdating Solr..."
curl -H "Content-Type: application/json" -b "$cookie" -b "XSRF-TOKEN=A_VALUE" -H "X-XSRF-TOKEN:A_VALUE" -X POST "http://${host}:${port}/studio/api/1/services/api/1/preview/sync-site.json?site=${site_id}"
echo
rm "$cookie"

echo -e "\nSample content is ready for use!"