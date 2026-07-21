import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../layouts/DashboardLayout"
import "./Invites.css"

const INVITES_API_URL = "http://localhost:3000/invites"

function InvitesPage() {
  const navigate = useNavigate()

  const [invites, setInvites] = useState([])
  const [selectedInvite, setSelectedInvite] = useState(null)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false)
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)

  useEffect(() => {
    fetchInvites()
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

  async function fetchInvites() {
    setLoading(true)
    setError("")

    try {
      const responseData = await apiRequest(
        `${INVITES_API_URL}/list`
      )

      const inviteData = getResponseData(responseData)

      setInvites(Array.isArray(inviteData) ? inviteData : [])
    } catch (apiError) {
      handleApiError(apiError)
    } finally {
      setLoading(false)
    }
  }

  function handleSelectInvite(invite) {
    clearMessages()
    setSelectedInvite(invite)
  }

  function closeSelectedInvite() {
    setSelectedInvite(null)
  }

  async function handleAcceptInvite() {
    if (!selectedInvite) return

    setSubmitting(true)
    clearMessages()

    try {
        const responseData = await apiRequest(
        `${INVITES_API_URL}/${selectedInvite.id}/accept`,
            {
                method: "POST",
            }
        )

        setIsAcceptModalOpen(false)
        setSelectedInvite(null)

        setSuccessMessage(
        responseData?.message || "Invitation accepted"
        )

        await fetchInvites()
    } catch (apiError) {
        handleApiError(apiError)
    } finally {
        setSubmitting(false)
    }
    }

  async function handleDeclineInvite() {
    if (!selectedInvite) return

    setSubmitting(true)
    clearMessages()

    try {
      const responseData = await apiRequest(
        `${INVITES_API_URL}/${selectedInvite.id}/decline`,
        {
            method: "DELETE",
        }
        )

        setIsDeclineModalOpen(false)
        setSelectedInvite(null)

        setSuccessMessage(
        responseData?.message || "Invitation declined"
        )

        await fetchInvites()
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

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  function getInviteId(invite) {
    return invite?.id ?? null
  }

  function getGroupId(invite) {
    return invite?.group_id ?? null
  }

  function getGroupName(invite) {
    return invite?.group_name ?? null
  }

  function getInviterName(invite) {
    return invite?.inviter_username ?? null
  }

  function getInviteDate(invite) {
    return invite?.created_at ?? null
  }

  return (
    <DashboardLayout
      activeNav="Invites"
      eyebrow="Invites"
      title="Group Invitations"
      subtitle="Review invitations to join availability groups."
    >
      <section className="invites-page">
        {error && <p className="invites-error">{error}</p>}

        {successMessage && (
          <p className="invites-success">{successMessage}</p>
        )}

        <section className="invites-header">
          <div>
            <h2 className="invites-page-title">
              Pending Invitations
            </h2>

            <p>
              {loading
                ? "Loading invitations..."
                : `${invites.length} invitation${
                    invites.length === 1 ? "" : "s"
                  }`}
            </p>
          </div>

          <button
            type="button"
            className="invites-refresh-button"
            onClick={fetchInvites}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </section>

        <section className="invites-main-grid">
          <section className="invites-list-panel">
            {loading ? (
              <div className="invites-empty">
                <p className="invites-loading-text">
                  Loading invitations...
                </p>
              </div>
            ) : invites.length === 0 ? (
              <div className="invites-empty">
                <h3>No pending invitations</h3>

                <p>
                  Group invitations sent to you will appear here.
                </p>
              </div>
            ) : (
              <div className="invites-list">
                {invites.map((invite) => {
                  const inviteId = getInviteId(invite)
                  const selectedInviteId =
                    getInviteId(selectedInvite)

                  const isSelected =
                    String(inviteId) === String(selectedInviteId)

                  return (
                    <button
                      key={inviteId}
                      type="button"
                      className={
                        isSelected
                          ? "invite-card invite-card-selected"
                          : "invite-card"
                      }
                      onClick={() => handleSelectInvite(invite)}
                    >
                      <div className="invite-card-header">
                        <h3>{getGroupName(invite)}</h3>

                        <span className="invite-status-pill">
                          Pending
                        </span>
                      </div>

                      <p>
                        Invited by{" "}
                        <strong>{getInviterName(invite)}</strong>
                      </p>

                      <div className="invite-card-footer">
                        <span>
                          {formatDate(getInviteDate(invite))}
                        </span>

                        <span>View invitation →</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          <aside className="invite-details-panel">
            {!selectedInvite ? (
              <div className="invites-empty">
                <p>
                  Select an invitation to view its details.
                </p>
              </div>
            ) : (
              <>
                <div className="invite-details-header">
                  <div>
                    <span className="selected-invite-pill">
                      Selected Invitation
                    </span>

                    <h2>{getGroupName(selectedInvite)}</h2>
                  </div>

                  <button
                    type="button"
                    className="invite-details-close-button"
                    onClick={closeSelectedInvite}
                  >
                    ×
                  </button>
                </div>

                <p className="invite-description">
                  You have been invited by{" "}
                  <strong>
                    {getInviterName(selectedInvite)}
                  </strong>{" "}
                  to join this group.
                </p>

                <div className="invite-details-list">
                  <div>
                    <span>Group</span>
                    <strong>
                      {getGroupName(selectedInvite)}
                    </strong>
                  </div>

                  <div>
                    <span>Group ID</span>
                    <strong>
                      {getGroupId(selectedInvite) ?? "Unknown"}
                    </strong>
                  </div>

                  <div>
                    <span>Invited By</span>
                    <strong>
                      {getInviterName(selectedInvite)}
                    </strong>
                  </div>

                  <div>
                    <span>Date Sent</span>
                    <strong>
                      {formatDate(getInviteDate(selectedInvite))}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong>Pending</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="invite-accept-button"
                  onClick={() => {
                    clearMessages()
                    setIsAcceptModalOpen(true)
                  }}
                >
                  Accept Invitation
                </button>

                <button
                  type="button"
                  className="invite-decline-button"
                  onClick={() => {
                    clearMessages()
                    setIsDeclineModalOpen(true)
                  }}
                >
                  Decline Invitation
                </button>
              </>
            )}
          </aside>
        </section>
      </section>

      {isAcceptModalOpen && selectedInvite && (
        <div
          className="modal-backdrop"
          onClick={() => setIsAcceptModalOpen(false)}
        >
          <div
            className="invite-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Accept Invitation</h2>

              <button
                type="button"
                className="modal-close-button"
                onClick={() => setIsAcceptModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>
                Join <strong>{getGroupName(selectedInvite)}</strong>?
              </p>

              <div className="invite-confirmation-actions">
                <button
                  type="button"
                  className="invite-cancel-button"
                  onClick={() => setIsAcceptModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="invite-confirm-accept-button"
                  onClick={handleAcceptInvite}
                  disabled={submitting}
                >
                  {submitting ? "Accepting..." : "Accept"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeclineModalOpen && selectedInvite && (
        <div
          className="modal-backdrop"
          onClick={() => setIsDeclineModalOpen(false)}
        >
          <div
            className="invite-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Decline Invitation</h2>

              <button
                type="button"
                className="modal-close-button"
                onClick={() => setIsDeclineModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>
                Decline the invitation to{" "}
                <strong>{getGroupName(selectedInvite)}</strong>?
              </p>

              <div className="invite-confirmation-actions">
                <button
                  type="button"
                  className="invite-cancel-button"
                  onClick={() => setIsDeclineModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="invite-confirm-decline-button"
                  onClick={handleDeclineInvite}
                  disabled={submitting}
                >
                  {submitting ? "Declining..." : "Decline"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default InvitesPage