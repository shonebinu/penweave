### PRIORITY

- /following page
- / landing page
- notification ( follow and fork notifications )
  (should i add notification from firebase fns??? then how to update notification state?)

### TO DO

- use enrichPlaygroundMeta on getBookmarkedPlaygrounds() and use promise.all in every place to fasten queries
- clicking on following, followers in /user should show a dialog showing them
- reorganize and rename fns under /service/firebase
- loading skeleton in /user and /following
- option to edit displayName and bio (add bio to user) (option to add twitter, linkedin , github links etc) in settings
- public unsigned /explore /user like /playground (try changing layout from outlet to children based individually)(or another sidebar with a big sign in button below... only explore button in sidebar)
- add tooltip on icon buttons
- sort based on forkCount && bookmarkCount | show trending (weekly, daily, monthly - option to select) on /explore page
- editing still possible on public different user and unsigned. give a toast info
- why handlesaveref is used?
- some buttons need alert dialogs - add them (change to public, private in /home)
- firebase security rules
- new logo / edit existing logo
- add full screen preview in dashboard
- instead of srcDoc rendering the code, use another method for complete isolation such as runner.html method
- implement pagination for explore, home etc
- debounce iframe so that flashes don't appear
- change firebase verification email and change password email template and also add returnUrl
- reset password, change email, unlink auth provider, delete account options

### LATER

- checkpoint/version control in penweave
- add bio in profile
- view forkers to owner (users who forked)
- add a button to see how many times i have forked the given playground(existing forks) (show alert if already forked once - needed ?)
- add full screen preview in the dashboard, by opening it in new tab or enlarging full screen
- custom theme for the app (try starry/dusty bg)
- give option to change profile pic
- option to change theme, font, add cdn links in playground (google fonts, libraries...)
- commenting ability?
- view password (eye icon) in shadcn input password field
- option to share as a webpage, export as a zip
- accept terms and coniditions in sign up
- returnUrl in protected routes to go back to that url once logged in
- try out playground option... just playground without any saving or anything
- js console in the playground
- shortcuts for code editor. implement vim mode
- linting and other extra features of codemirror
- ability to embed just like codepen
- pin playground in the dashboard (our own)
- setup returnUrl for protected routes
- instead of to sign in just after sign up. sign then it. but to create a playground. they need to verify
