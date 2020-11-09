# Basic Git Workflow

## Working on a feature

1. Go to the Projects Tab
2. Select a TODO card and click on 'Convert to issue', describe it
3. Go to the Issues tab, and assign someone (or yourself)
4. In your terminal, create a new branch using 'git branch <nameofbranch>'
5. Move to the branch using 'git checkout <nameofbranch>'
6. Work and commit etc
7. On GitHub, you'll be able to create a Pull Request matching the branch
8. When you're done with it, assign the other to a review

## Merge
1. Make sure your local branch is up to date with its matching remote branch 'git pull'.
2. Checkout to the master branch 'git checkout master'
3. Merge your branch into master by using 'git merge <branchname>'.
