# Create PDFs folders
New-Item -ItemType Directory -Force -Path "deliverables/PDFs"
New-Item -ItemType Directory -Force -Path "honor-code/PDFs"
New-Item -ItemType Directory -Force -Path "minutes-of-meetings/PDFs"

# Main milestone-1 markdown files
# Each md-to-pdf call generates the PDF next to the source file, then we move and rename it.

cmd /c "md-to-pdf deliverables/0_index-of-deliverables.md"
Move-Item -Force "deliverables/0_index-of-deliverables.pdf" "deliverables/PDFs/0_Index of Deliverables.pdf"

cmd /c "md-to-pdf deliverables/1_problem-statement.md"
Move-Item -Force "deliverables/1_problem-statement.pdf" "deliverables/PDFs/1_Problem Statement.pdf"

cmd /c "md-to-pdf deliverables/2_users-of-application.md"
Move-Item -Force "deliverables/2_users-of-application.pdf" "deliverables/PDFs/2_Users of Application.pdf"

cmd /c "md-to-pdf deliverables/3.1_requirements-gathering.md"
Move-Item -Force "deliverables/3.1_requirements-gathering.pdf" "deliverables/PDFs/3.1_Requirements Gathering.pdf"

cmd /c "md-to-pdf deliverables/3.2_interview-questions-and-responses.md"
Move-Item -Force "deliverables/3.2_interview-questions-and-responses.pdf" "deliverables/PDFs/3.2_Interview Questions and Responses.pdf"

cmd /c "md-to-pdf deliverables/3.3_pain-points-and-concerns.md"
Move-Item -Force "deliverables/3.3_pain-points-and-concerns.pdf" "deliverables/PDFs/3.3_Pain Points and Concerns.pdf"

cmd /c "md-to-pdf deliverables/4_user-stories.md"
Move-Item -Force "deliverables/4_user-stories.pdf" "deliverables/PDFs/4_User Stories.pdf"

cmd /c "md-to-pdf deliverables/5_requirements-analysis.md"
Move-Item -Force "deliverables/5_requirements-analysis.pdf" "deliverables/PDFs/5_Requirements Analysis.pdf"

cmd /c "md-to-pdf deliverables/team-details.md"
Move-Item -Force "deliverables/team-details.pdf" "deliverables/PDFs/Team Details.pdf"

# Interview recordings - save alongside the source
cmd /c "md-to-pdf interview-recordings/recording-details.md"
Move-Item -Force "interview-recordings/recording-details.pdf" "interview-recordings/Recording Details.pdf"

# Honor code files (skip the template)
cmd /c "md-to-pdf honor-code/harikesh-shukla-honor-code.md"
Move-Item -Force "honor-code/harikesh-shukla-honor-code.pdf" "honor-code/PDFs/Harikesh Shukla Honor Code.pdf"

cmd /c "md-to-pdf honor-code/rahul-maurya-honor-code.md"
Move-Item -Force "honor-code/rahul-maurya-honor-code.pdf" "honor-code/PDFs/Rahul Maurya Honor Code.pdf"

cmd /c "md-to-pdf honor-code/vidhatri-h-r-honor-code.md"
Move-Item -Force "honor-code/vidhatri-h-r-honor-code.pdf" "honor-code/PDFs/Vidhatri H R Honor Code.pdf"

# Minutes of meetings
cmd /c "md-to-pdf minutes-of-meetings/june-24-team-meeting.md"
Move-Item -Force "minutes-of-meetings/june-24-team-meeting.pdf" "minutes-of-meetings/PDFs/June 24 Team Meeting.pdf"

cmd /c "md-to-pdf minutes-of-meetings/june-26-client-meeting.md"
Move-Item -Force "minutes-of-meetings/june-26-client-meeting.pdf" "minutes-of-meetings/PDFs/June 26 Client Meeting.pdf"

cmd /c "md-to-pdf minutes-of-meetings/june-28-team-meeting.md"
Move-Item -Force "minutes-of-meetings/june-28-team-meeting.pdf" "minutes-of-meetings/PDFs/June 28 Team Meeting.pdf"
