# Create PDFs folders
New-Item -ItemType Directory -Force -Path "PDFs"
New-Item -ItemType Directory -Force -Path "honor-code/PDFs"

# Main milestone-1 markdown files
# Each md-to-pdf call generates the PDF next to the source file, then we move and rename it.

cmd /c "md-to-pdf 0_index-of-deliverables.md"
Move-Item -Force "0_index-of-deliverables.pdf" "PDFs/0_Index of Deliverables.pdf"

cmd /c "md-to-pdf 1_problem-statement.md"
Move-Item -Force "1_problem-statement.pdf" "PDFs/1_Problem Statement.pdf"

cmd /c "md-to-pdf 2_users-of-application.md"
Move-Item -Force "2_users-of-application.pdf" "PDFs/2_Users of Application.pdf"

cmd /c "md-to-pdf 3.1_requirements-gathering.md"
Move-Item -Force "3.1_requirements-gathering.pdf" "PDFs/3.1_Requirements Gathering.pdf"

cmd /c "md-to-pdf 3.2_interview-questions-and-responses.md"
Move-Item -Force "3.2_interview-questions-and-responses.pdf" "PDFs/3.2_Interview Questions and Responses.pdf"

cmd /c "md-to-pdf 3.3_pain-points-and-concerns.md"
Move-Item -Force "3.3_pain-points-and-concerns.pdf" "PDFs/3.3_Pain Points and Concerns.pdf"

cmd /c "md-to-pdf 4_user-stories.md"
Move-Item -Force "4_user-stories.pdf" "PDFs/4_User Stories.pdf"

cmd /c "md-to-pdf 5_requirements-analysis.md"
Move-Item -Force "5_requirements-analysis.pdf" "PDFs/5_Requirements Analysis.pdf"

cmd /c "md-to-pdf team-details.md"
Move-Item -Force "team-details.pdf" "PDFs/Team Details.pdf"

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
