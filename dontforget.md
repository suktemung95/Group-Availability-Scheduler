# remember
- input validation for everything
- fix time zones in user.services.convertTime() *dont assume time zone*

- GET /users/:userId/schedule for viewing another user's schedule IN same group

# next steps: 
- add cancel invite for groups (no more join?)
- make sure a user isn't in a group when they're invited to it

# edge cases
- cannot invite yourself
- cannot invite someone already in the group
- cannot send duplicate invite
- only owner/admin can invite, if that is your rule
- declining invite deletes it
- accepting invite twice should not break
- when leaving a group, check if they are the owner