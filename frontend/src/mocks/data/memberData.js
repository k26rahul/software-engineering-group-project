export const getMemberApprovalMockResponse = (id) => ({
  id: id,
  name: id === 4 ? "Sneha Reddy" : "Amit Patel",
  email: id === 4 ? "pending_member1@example.com" : "pending_member2@example.com",
  role: "MEMBER",
  membership_type: id === 4 ? "ON_CAMPUS" : "OFF_CAMPUS",
  approval_status: "APPROVED",
  is_active: true,
  created_at: new Date().toISOString(),
  membership_start_date: new Date().toISOString().split("T")[0],
  max_issue_limit: 3,
});

export const getMemberRejectionMockResponse = (id) => ({
  id: id,
  name: id === 4 ? "Sneha Reddy" : "Amit Patel",
  email: id === 4 ? "pending_member1@example.com" : "pending_member2@example.com",
  role: "MEMBER",
  membership_type: id === 4 ? "ON_CAMPUS" : "OFF_CAMPUS",
  approval_status: "REJECTED",
  is_active: false,
  created_at: new Date().toISOString(),
  membership_start_date: null,
  max_issue_limit: 3,
});
