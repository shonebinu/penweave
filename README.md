# PenWeave

For testing purpose run runner.html with python http server

## TODO

### Important

- REPLAN EVERYTHING. WIREFRAME AND DB BEFORE CODE
- [ ] properly setup editor... preview is getting messed up... 100vh preview??? what to do??? resize editor and preview??? when user changes height in css??? default height???
- [ ] edit details and delete project in project pane

### Rest of the stuff

- [ ] light dark mode
- [ ] Change Supabase email template
- [ ] Add Terms and Services page
- [ ] Landing page (reference: [codecatch.net](https://codecatch.net/))
- [ ] try to make sense of useProjectPreview
- [ ] add settings to change line wrap, font size, font, theme for editor - dont allow change font, use default font
- [ ] Implement Row Level Security (RLS) for tables and storage
- [ ] notifications system using database triggers?
- [ ] solve preview scroll issues (mthds -> add btn go to top... preview pane full screen another tab etc...)
- [ ] Read console messages and display them to the user. Something like this ->

  ```
  iframe.srcdoc = `<!DOCTYPE html>
  <html>
    <head>
      <style>${css}</style>
    </head>
    <body>
      ${html}
      <script>
        // Capture console logs
        const originalLog = console.log;
        console.log = function(...args) {
          window.parent.postMessage({
            type: "console:log",
            payload: args.map(String).join(" "),
          }, "${MESSAGE_ORIGIN}");
          originalLog.apply(console, args);
        };

        // Capture errors
        window.onerror = function(message, source, lineno, colno, error) {
          window.parent.postMessage({
            type: "console:error",
            payload: message + " at " + source + ":" + lineno + ":" + colno,
          }, "${MESSAGE_ORIGIN}");
        };

        ${js}
      <\/script>

    </body>
  </html>`;
  ```

- [ ] htmlToJpeg - add backgroundcolor white if body doesn't have one in the iframe - full height screenshot vs partial?
- [ ] if project public and user not logged in, what to show for world
- [ ] pagination in explore, projects etc...
- [ ] report pen feature
- [ ] iframe runner -> setup env vars | where to put runner html | send width height as url param | iframe in different page
  - https://www.reddit.com/r/reactjs/comments/1cfmkrs/iframe_security_risk/
  - https://github.com/mdn/yari/blob/next-2024-07-03/client/public/runner.html
- [ ] database trigger for notifications table
- [ ] should i implement redirect url? theme switch? code editor settings? auth flashing issues? custom email, password fields from daisyui? embed mode? preview mode???
