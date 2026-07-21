import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../layouts/DashboardLayout"
import "./Groups.css"

const GROUPS_API_URL = "http://localhost:3000/groups"

function GroupsPage() {
  const navigate = useNavigate()

  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [overlap, setOverlap] = useState([])

  const [loadingGroups, setLoadingGroups] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)

  const [createName, setCreateName] = useState("")
  const [createDescription, setCreateDescription] = useState("")
  const [joinGroupId, setJoinGroupId] = useState("")
  const [inviteUser, setInviteUser] = useState("")

  useEffect(() => {
    fetchGroups()
  }, [])

  async function apiRequest(url, options = {}) {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("You are not logged in")
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body
          ? {
              "Content-Type": "application/json",
            }
          : {}),
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    let responseData = null

    try {
      responseData = await response.json()
    } catch {
      responseData = null
    }

    if (!response.ok) {
      throw new Error(
        responseData?.message ||
          responseData?.error ||
          `Request failed with status ${response.status}`
      )
    }

    return responseData
  }

  function getResponseData(responseData) {
    if (!responseData) return null

    if (responseData.data !== undefined) {
      return responseData.data
    }

    return responseData
  }

  function handleApiError(apiError) {
    setError(apiError.message)
    console.error(apiError)

    if (
      apiError.message === "Invalid or expired token" ||
      apiError.message === "You are not logged in"
    ) {
      localStorage.removeItem("token")
      navigate("/login")
    }
  }

  function clearMessages() {
    setError("")
    setSuccessMessage("")
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false)
    setCreateName("")
    setCreateDescription("")
  }

  function closeJoinModal() {
    setIsJoinModalOpen(false)
    setJoinGroupId("")
  }

  function closeInviteModal() {
    setIsInviteModalOpen(false)
    setInviteUser("")
  }

  async function fetchGroups() {
    setLoadingGroups(true)
    setError("")

    try {
      const responseData = await apiRequest(`${GROUPS_API_URL}/list`)
      const groupMemberships = getResponseData(responseData)

      setGroups(Array.isArray(groupMemberships) ? groupMemberships : [])
    } catch (apiError) {
      handleApiError(apiError)
    } finally {
      setLoadingGroups(false)
    }
  }

  async function fetchGroupMembers(groupId) {
    const responseData = await apiRequest(
      `${GROUPS_API_URL}/${groupId}/members`
    )

    const memberData = getResponseData(responseData)

    return Array.isArray(memberData) ? memberData : []
  }

  async function fetchGroupOverlap(groupId) {
    const responseData = await apiRequest(
      `${GROUPS_API_URL}/${groupId}/overlap`
    )

    const overlapData = getResponseData(responseData)

    return Array.isArray(overlapData) ? overlapData : []
  }

  async function handleSelectGroup(group) {
    setSelectedGroup(group)
    setMembers([])
    setOverlap([])
    setLoadingDetails(true)
    clearMessages()

    try {
      const [memberData, overlapData] = await Promise.all([
        fetchGroupMembers(group.group_id),
        fetchGroupOverlap(group.group_id),
      ])

      setMembers(memberData)
      setOverlap(overlapData)
    } catch (apiError) {
      handleApiError(apiError)
    } finally {
      setLoadingDetails(false)
    }
  }

  async function refreshSelectedGroup() {
    if (!selectedGroup) return

    await handleSelectGroup(selectedGroup)
  }

  async function handleCreateGroup(event) {
    event.preventDefault()

    if (!createName.trim()) {
      setError("Group name is required")
      return
    }

    setSubmitting(true)
    clearMessages()

    try {
      const responseData = await apiRequest(GROUPS_API_URL, {
        method: "POST",
        body: JSON.stringify({
          name: createName.trim(),
          description: createDescription.trim(),
        }),
      })

      closeCreateModal()

      setSuccessMessage(
        responseData?.message || "Successfully created group"
      )

      await fetchGroups()
    } catch (apiError) {
      handleApiError(apiError)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleJoinGroup(event) {
    event.preventDefault()

    const normalizedGroupId = Number(joinGroupId)

    if (!Number.isInteger(normalizedGroupId) || normalizedGroupId <= 0) {
      setError("Enter a valid group ID")
      return
    }

    setSubmitting(true)
    clearMessages()

    try {
      const responseData = await apiRequest(
        `${GROUPS_API_URL}/${normalizedGroupId}/join`,
        {
          method: "POST",
        }
      )

      closeJoinModal()

      setSuccessMessage(
        responseData?.message || "Successfully joined group"
      )

      await fetchGroups()
    } catch (apiError) {
      handleApiError(apiError)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleInviteUser(event) {
    event.preventDefault()

    if (!selectedGroup) return

    setSubmitting(true)
    clearMessages()

    try {
      const responseData = await apiRequest(
        `${GROUPS_API_URL}/${selectedGroup.group_id}/invite/${inviteUser}`,
        {
          method: "POST",
        }
      )

      closeInviteModal()

      setSuccessMessage(
        responseData?.message || "Successfully invited user"
      )
    } catch (apiError) {
      handleApiError(apiError)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLeaveGroup() {
    if (!selectedGroup) return

    setSubmitting(true)
    clearMessages()

    try {
      const responseData = await apiRequest(
        `${GROUPS_API_URL}/${selectedGroup.group_id}/leave`,
        {
          method: "POST",
        }
      )

      setIsLeaveModalOpen(false)
      setSelectedGroup(null)
      setMembers([])
      setOverlap([])

      setSuccessMessage(
        responseData?.message || "Successfully left group"
      )

      await fetchGroups()
    } catch (apiError) {
      handleApiError(apiError)
    } finally {
      setSubmitting(false)
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) return "Unknown"

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return "Unknown"
    }

    return date.toLocaleDateString()
  }

  function formatTime(timeValue) {
    if (!timeValue) return "Unknown"

    const [hourString, minuteString] = timeValue.split(":")
    const hour = Number(hourString)
    const minute = Number(minuteString)

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return timeValue
    }

    const suffix = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    const displayMinute = String(minute).padStart(2, "0")

    return `${displayHour}:${displayMinute} ${suffix}`
  }

  function getDayName(dayOfWeek) {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]

    return days[Number(dayOfWeek) - 1] || `Day ${dayOfWeek}`
  }

  function renderOverlap() {
    if (loadingDetails) {
      return (
        <p className="groups-loading-text">
          Loading shared availability...
        </p>
      )
    }

    if (overlap.length === 0) {
      return (
        <p className="groups-muted-text">
          No shared availability was found.
        </p>
      )
    }

    return (
      <div className="group-overlap-list">
        {overlap.map((block, index) => (
          <div
            key={
              block.id ||
              `${block.dow}-${block.start}-${block.end}-${index}`
            }
            className="group-overlap-item"
          >
            <strong>{getDayName(block.dow)}</strong>

            <span>
              {formatTime(block.start)}
              {" – "}
              {formatTime(block.end)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <DashboardLayout
      activeNav="Groups"
      eyebrow="Groups"
      title="Your Groups"
      subtitle="Create groups and compare availability with other members."
    >
      <section className="groups-page">
        {error && <p className="groups-error">{error}</p>}

        {successMessage && (
          <p className="groups-success">{successMessage}</p>
        )}

        <section className="groups-header">
          <div>
            <h2 className="groups-page-title">Groups</h2>

            <p>
              {loadingGroups
                ? "Loading groups..."
                : `${groups.length} group${groups.length === 1 ? "" : "s"}`}
            </p>
          </div>

          <div className="groups-header-actions">

            <button
              type="button"
              className="groups-primary-button"
              onClick={() => {
                clearMessages()
                setIsCreateModalOpen(true)
              }}
            >
              + Create Group
            </button>
          </div>
        </section>

        <section className="groups-main-grid">
          <section className="groups-list-panel">
            {loadingGroups ? (
              <div className="groups-empty">
                <p className="groups-loading-text">
                  Loading groups...
                </p>
              </div>
            ) : groups.length === 0 ? (
              <div className="groups-empty">
                <h3>No groups yet</h3>
                <p>Create a group or join one using its group ID.</p>
              </div>
            ) : (
              <div className="groups-list">
                {groups.map((group) => {
                  const isSelected =
                    selectedGroup?.group_id === group.group_id

                  return (
                    <button
                      key={group.group_id}
                      type="button"
                      className={
                        isSelected
                          ? "group-card group-card-selected"
                          : "group-card"
                      }
                      onClick={() => handleSelectGroup(group)}
                    >
                      <div className="group-card-header">
                        <h3>{group.name}</h3>

                        <span className="group-role-pill">
                          {group.role}
                        </span>
                      </div>

                      <p>{group.description || "No group description"}</p>

                      <div className="group-card-footer">
                        <span>
                          Joined {formatDate(group.joined_at)}
                        </span>

                        <span>View details →</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          <aside className="group-details-panel">
            {!selectedGroup ? (
              <div className="groups-empty">
                <p>Select a group to view its details.</p>
              </div>
            ) : (
              <>
                <div className="group-details-header">
                  <div>
                    <span className="selected-pill">
                      Selected Group
                    </span>

                    <h2>{selectedGroup.name}</h2>
                  </div>

                  <button
                    type="button"
                    className="details-close-button"
                    onClick={() => {
                      setSelectedGroup(null)
                      setMembers([])
                      setOverlap([])
                    }}
                  >
                    ×
                  </button>
                </div>

                <p className="group-description">
                  {selectedGroup.description ? selectedGroup.description : "No group description"}
                </p>

                <div className="group-details-list">
                  <div>
                    <span>Group ID</span>
                    <strong>{selectedGroup.group_id}</strong>
                  </div>

                  <div>
                    <span>Your Role</span>
                    <strong>{selectedGroup.role}</strong>
                  </div>

                  <div>
                    <span>Joined</span>
                    <strong>
                      {formatDate(selectedGroup.joined_at)}
                    </strong>
                  </div>

                  <div>
                    <span>Members</span>
                    <strong>
                      {loadingDetails ? "Loading..." : members.length}
                    </strong>
                  </div>
                </div>

                <section className="group-detail-section">
                  <div className="group-detail-section-header">
                    <h3>Members</h3>

                    <button
                      type="button"
                      className="group-small-button"
                      onClick={refreshSelectedGroup}
                      disabled={loadingDetails}
                    >
                      Refresh
                    </button>
                  </div>

                  {loadingDetails ? (
                    <p className="groups-loading-text">
                      Loading members...
                    </p>
                  ) : members.length === 0 ? (
                    <p className="groups-muted-text">
                      No members were returned.
                    </p>
                  ) : (
                    <div className="group-members-list">
                      {members.map((member) => (
                        <div
                          key={member.user_id}
                          className="group-member-row"
                        >
                          <strong>{member.username}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="group-detail-section">
                  <h3>Shared Availability</h3>
                  {renderOverlap()}
                </section>

                <button
                  type="button"
                  className="details-primary-button"
                  onClick={() => {
                    clearMessages()
                    setIsInviteModalOpen(true)
                  }}
                >
                  Invite User
                </button>

                <button
                  type="button"
                  className="details-secondary-button groups-danger-button"
                  onClick={() => {
                    clearMessages()
                    setIsLeaveModalOpen(true)
                  }}
                >
                  Leave Group
                </button>
              </>
            )}
          </aside>
        </section>
      </section>

      {isCreateModalOpen && (
        <div
          className="modal-backdrop"
          onClick={closeCreateModal}
        >
          <form
            className="group-modal"
            onSubmit={handleCreateGroup}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Create Group</h2>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeCreateModal}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <label className="group-modal-field">
                <span>Group Name</span>

                <input
                  type="text"
                  value={createName}
                  onChange={(event) =>
                    setCreateName(event.target.value)
                  }
                  placeholder="Weekend Volleyball"
                  required
                />
              </label>

              <label className="group-modal-field">
                <span>Description</span>

                <textarea
                  value={createDescription}
                  onChange={(event) =>
                    setCreateDescription(event.target.value)
                  }
                  placeholder="Describe the purpose of this group..."
                  rows="3"
                />
              </label>

              <button
                type="submit"
                className="group-modal-submit-button"
                disabled={submitting || !createName.trim()}
              >
                {submitting ? "Creating..." : "Create Group"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isInviteModalOpen && selectedGroup && (
        <div
          className="modal-backdrop"
          onClick={closeInviteModal}
        >
          <form
            className="group-modal"
            onSubmit={handleInviteUser}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Invite User</h2>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeInviteModal}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>
                Invite a user to {selectedGroup.name}.
              </p>

              <label className="group-modal-field">
                <span>Username</span>

                <input
                  type="text"
                  value={inviteUser}
                  onChange={(event) =>
                    setInviteUser(event.target.value)
                  }
                  placeholder="Enter the username"
                  required
                />
              </label>

              <button
                type="submit"
                className="group-modal-submit-button"
                disabled={submitting || !inviteUser}
              >
                {submitting ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLeaveModalOpen && selectedGroup && (
        <div
          className="modal-backdrop"
          onClick={() => setIsLeaveModalOpen(false)}
        >
          <div
            className="group-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Leave Group</h2>

              <button
                type="button"
                className="modal-close-button"
                onClick={() => setIsLeaveModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to leave Group #
                {selectedGroup.group_id}?
              </p>

              <div className="group-confirmation-actions">
                <button
                  type="button"
                  className="group-cancel-button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="group-leave-button"
                  onClick={handleLeaveGroup}
                  disabled={submitting}
                >
                  {submitting ? "Leaving..." : "Leave Group"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default GroupsPage