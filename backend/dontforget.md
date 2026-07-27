# remember
- input validation for everything
- fix time zones in user.services.convertTime() *dont assume time zone*
- GET /users/:userId/schedule for viewing another user's schedule IN same group
- add more roles (maybe admin) and permissions in each role
- remove member / delete group
- make atomic transacation calls
- overnight block options (let a block go past midnight in their respective timezone)
- option to change timezone

# next steps: 
- delete group when members = 0

# edge cases
- cannot invite yourself
- cannot invite someone already in the group
- cannot send duplicate invite
- only owner/admin can invite, if that is your rule
- declining invite deletes it
- accepting invite twice should not break
- when leaving a group, check if they are the owner
- owner can also revoke invites
- make sure a user isn't in a group when they're invited to it

# untested
- invitePool.getInvite in verifyInvited()
- getInvites in invite.controller.js

# tests
Overlap
✓ normal overlap
✓ no overlap
✓ multiple intervals
✓ midnight boundary