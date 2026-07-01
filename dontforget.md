# remember
- refactor everything correctly
- input validation for everything
- make helpers for certain DB queries
- fix time zones in user.services.convertTime() *dont assume time zone*
- when leaving a group, check if they are the owner
- move all DB calls into ./db

# next steps: 
- refactor controllers
- add invites for groups
- GET /users/:userId/schedule for viewing another user's schedule IN same group
- add middleware for all required auth