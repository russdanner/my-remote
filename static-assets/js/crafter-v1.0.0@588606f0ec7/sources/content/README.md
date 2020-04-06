# About
This folder contains sample content for use during development or on demo sites.

## Applying Sample Content
If you are developing, switch to a new branch now; sample content should **not** be committed back to Github.  
`git checkout -b testing`

Execute `copy_content.sh` to place sample channels, streams, and images.  
Example: `./sources/content/copy_content.sh`  
_* Note that any file with the same name will be overwritten (e.g. site/taxonomies/video-streams.xml)_

Save and index the content:
1. Commit the changes: `git add -A && git commit -a -m "sample content"`
1. Open Crafter Studio
   * Open Site Config
   * Sync From Repository
   * Preview Sync

Sample content should now be fully accessible.

#### Local Development
The steps above are consolidated in the `branch_content.sh` script.

Execution of this script will
* Create a new branch for testing content
* Copy sample content
* Refresh Crafter via API calls  
During execution, you will be prompted for environment information/confirmation.

After your testing is complete, you can remove this branch as described below.

## Removing Sample Content
If you were developing and created a test branch, simply delete that branch after switching back to the one with your code.  
`git checkout branchWithYourCode`
`git branch -D testing`  

If you were unable to use a separate branch for your content testing, execute `remove_content.sh` and then git commit.  
Example:  
`./sources/content/remove_content.sh`  
`git commit -a -m "removing sample content"`

Ensure that sample content is **not** pushed to Github outside of the sources folder.