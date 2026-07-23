# Create PDFs folders
New-Item -ItemType Directory -Force -Path "PDFs"
New-Item -ItemType Directory -Force -Path "deliverables/PDFs"
New-Item -ItemType Directory -Force -Path "minutes-of-meetings/PDFs"

# Main milestone-2 markdown files
cmd /c "md-to-pdf git-collaboration-workflow.md"
Move-Item -Force "git-collaboration-workflow.pdf" "PDFs/Git Collaboration Workflow.pdf"

cmd /c "md-to-pdf milestone-2-backlogs.md"
Move-Item -Force "milestone-2-backlogs.pdf" "PDFs/Milestone 2 Backlogs.pdf"

cmd /c "md-to-pdf milestone-2-deliverables.md"
Move-Item -Force "milestone-2-deliverables.pdf" "PDFs/Milestone 2 Deliverables.pdf"

cmd /c "md-to-pdf tech-stack.md"
Move-Item -Force "tech-stack.pdf" "PDFs/Tech Stack.pdf"

# Deliverables
cmd /c "md-to-pdf deliverables/0_index-of-deliverables.md"
Move-Item -Force "deliverables/0_index-of-deliverables.pdf" "deliverables/PDFs/0_Index of Deliverables.pdf"

cmd /c "md-to-pdf deliverables/1.1_design-of-components.md"
Move-Item -Force "deliverables/1.1_design-of-components.pdf" "deliverables/PDFs/1.1_Design of Components.pdf"

cmd /c "md-to-pdf deliverables/1.2_frontend-components.md"
Move-Item -Force "deliverables/1.2_frontend-components.pdf" "deliverables/PDFs/1.2_Frontend Components.pdf"

cmd /c "md-to-pdf deliverables/1.3_backend-components.md"
Move-Item -Force "deliverables/1.3_backend-components.pdf" "deliverables/PDFs/1.3_Backend Components.pdf"

cmd /c "md-to-pdf deliverables/1.4_database-components.md"
Move-Item -Force "deliverables/1.4_database-components.pdf" "deliverables/PDFs/1.4_Database Components.pdf"

cmd /c "md-to-pdf deliverables/1.5_inter-component-flow.md"
Move-Item -Force "deliverables/1.5_inter-component-flow.pdf" "deliverables/PDFs/1.5_Inter-Component Flow.pdf"

cmd /c "md-to-pdf deliverables/2_class-diagram.md"
Move-Item -Force "deliverables/2_class-diagram.pdf" "deliverables/PDFs/2_Class Diagram.pdf"

cmd /c "md-to-pdf deliverables/3_database-design-diagram.md"
Move-Item -Force "deliverables/3_database-design-diagram.pdf" "deliverables/PDFs/3_Database Design Diagram.pdf"

cmd /c "md-to-pdf deliverables/4_sprint-schedule.md"
Move-Item -Force "deliverables/4_sprint-schedule.pdf" "deliverables/PDFs/4_Sprint Schedule.pdf"

cmd /c "md-to-pdf deliverables/5_scrum-meetings-schedule.md"
Move-Item -Force "deliverables/5_scrum-meetings-schedule.pdf" "deliverables/PDFs/5_Scrum Meetings Schedule.pdf"

# Minutes of meetings
cmd /c "md-to-pdf minutes-of-meetings/individual-contributions.md"
Move-Item -Force "minutes-of-meetings/individual-contributions.pdf" "minutes-of-meetings/PDFs/Individual Contributions.pdf"

cmd /c "md-to-pdf minutes-of-meetings/july-02-team-meeting.md"
Move-Item -Force "minutes-of-meetings/july-02-team-meeting.pdf" "minutes-of-meetings/PDFs/July 02 Team Meeting.pdf"

cmd /c "md-to-pdf minutes-of-meetings/july-03-team-meeting.md"
Move-Item -Force "minutes-of-meetings/july-03-team-meeting.pdf" "minutes-of-meetings/PDFs/July 03 Team Meeting.pdf"

cmd /c "md-to-pdf minutes-of-meetings/july-04-team-meeting.md"
Move-Item -Force "minutes-of-meetings/july-04-team-meeting.pdf" "minutes-of-meetings/PDFs/July 04 Team Meeting.pdf"

cmd /c "md-to-pdf minutes-of-meetings/july-06-team-meeting.md"
Move-Item -Force "minutes-of-meetings/july-06-team-meeting.pdf" "minutes-of-meetings/PDFs/July 06 Team Meeting.pdf"

cmd /c "md-to-pdf minutes-of-meetings/july-07-team-meeting.md"
Move-Item -Force "minutes-of-meetings/july-07-team-meeting.pdf" "minutes-of-meetings/PDFs/July 07 Team Meeting.pdf"

cmd /c "md-to-pdf minutes-of-meetings/july-08-team-meeting.md"
Move-Item -Force "minutes-of-meetings/july-08-team-meeting.pdf" "minutes-of-meetings/PDFs/July 08 Team Meeting.pdf"

cmd /c "md-to-pdf minutes-of-meetings/july-09-team-meeting.md"
Move-Item -Force "minutes-of-meetings/july-09-team-meeting.pdf" "minutes-of-meetings/PDFs/July 09 Team Meeting.pdf"

cmd /c "md-to-pdf minutes-of-meetings/july-10-team-meeting.md"
Move-Item -Force "minutes-of-meetings/july-10-team-meeting.pdf" "minutes-of-meetings/PDFs/July 10 Team Meeting.pdf"

cmd /c "md-to-pdf minutes-of-meetings/july-14-team-meeting.md"
Move-Item -Force "minutes-of-meetings/july-14-team-meeting.pdf" "minutes-of-meetings/PDFs/July 14 Team Meeting.pdf"

cmd /c "md-to-pdf minutes-of-meetings/july-17-team-meeting.md"
Move-Item -Force "minutes-of-meetings/july-17-team-meeting.pdf" "minutes-of-meetings/PDFs/July 17 Team Meeting.pdf"

cmd /c "md-to-pdf minutes-of-meetings/july-20-team-meeting.md"
Move-Item -Force "minutes-of-meetings/july-20-team-meeting.pdf" "minutes-of-meetings/PDFs/July 20 Team Meeting.pdf"
