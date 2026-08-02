export let mockNotifications = [
  {
    id: 1,
    type: "OVERDUE_REMINDER",
    message: "Book 'The Catcher in the Rye' copy #2 is overdue by 15 days.",
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 2,
    type: "REGISTRATION_APPROVED",
    message: "New member 'Sneha Reddy' registration is pending approval.",
    is_read: false,
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: 3,
    type: "BILLING_RENEWAL",
    message: "Monthly budget utilization is at 23%.",
    is_read: false,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
];
