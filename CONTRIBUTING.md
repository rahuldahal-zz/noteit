# Setup on your local machine

1. Fork this repository,
click on the *fork* icon located on top-right side of this page, below your avatar

2. Clone that *forked* repository.

```bash
git clone https://github.com/[yourUsername]/NoteIT.git noteit
```

3. Set up the *upstream* remote URL for referencing the original repository

```bash
git remote add upstream https://github.com/rahuldahal/NoteIT
```

4. from the noteit directory, install necessary dependencies

```bash
cd noteit
```

```bash
npm install
```

## The generic workflow

1. Pull the latest changes from the original repository (the upstream)

```bash
git pull upstream master
```

2. Then, create a branch for every new feature/bug fix

```bash
git checkout -b [branchName] # eg. git checkout -b signup-feature
```

3. Start the server

```bash
npm run dev # on http://localhost:3000
```

  > This will start the mongodb server (locally), express server and webpack (within express via [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware))
  
4. Do your change / Implement a new feature
5. Don't forget to keep pushing your progress to the remote (your *forked* repository)

```bash
git add .
git commit -m "brief about your change..."
git push -u origin [branchName]
```
[message me](https://twitter.com/raahuldaahal) if you have any problem

# Getting ready to send a Pull Request

1. Make sure all the test passes.

```bash
npm test # should pass all the checks
```

2. Create a pull request,
	* Go to your *forked* repository on github,
	* If there are no conflicts, you will see a button saying  **create a new Pull Request**.
	* click on that big green button.
