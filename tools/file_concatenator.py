import tkinter as tk
from tkinter import filedialog, messagebox
import pathlib
import json

CONFIG_FILE = pathlib.Path.home() / ".file_concatenator_config.json"

def load_saved_files():
    if CONFIG_FILE.is_file():
        try:
            content = CONFIG_FILE.read_text(encoding='utf-8')
            return json.loads(content)
        except Exception:
            return []
    return []

def save_files(files_list):
    try:
        CONFIG_FILE.write_text(json.dumps(files_list), encoding='utf-8')
    except Exception as e:
        print(f"Failed to save config: {e}")

def process_files(file_paths):
    file_paths = sorted(list(set(file_paths)))
    output = []
    
    for path_str in file_paths:
        path_str = path_str.strip('"\' ')
        if not path_str:
            continue
            
        p = pathlib.Path(path_str)
        if not p.is_file():
            continue
            
        try:
            content = p.read_text(encoding='utf-8')
            output.append(f"==========\nFILE: {p.resolve()}\n==========\n{content}\n")
        except Exception as e:
            output.append(f"==========\nERROR READING: {p.resolve()}\n{e}\n==========\n")
            
    return "\n".join(output)

class FileConcatApp:
    def __init__(self, root):
        self.root = root
        root.title("Minimal File Concatenator")
        
        # --- File Selection Frame ---
        self.file_frame = tk.Frame(root)
        self.file_frame.pack(fill='both', expand=True, padx=5, pady=5)
        
        self.file_label = tk.Label(self.file_frame, text="Selected Files:")
        self.file_label.pack(anchor='w')
        
        # Listbox and Scrollbar for files
        self.list_scroll = tk.Scrollbar(self.file_frame)
        self.list_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.file_listbox = tk.Listbox(self.file_frame, selectmode=tk.EXTENDED, yscrollcommand=self.list_scroll.set, height=8)
        self.file_listbox.pack(side=tk.LEFT, fill='both', expand=True)
        self.list_scroll.config(command=self.file_listbox.yview)
        
        # Load saved files
        for f in load_saved_files():
            self.file_listbox.insert(tk.END, f)
            
        # File Action Buttons
        self.file_btn_frame = tk.Frame(root)
        self.file_btn_frame.pack(fill='x', padx=5)
        
        self.btn_select = tk.Button(self.file_btn_frame, text="Select Files", command=self.select_files)
        self.btn_select.pack(side=tk.LEFT, padx=5)
        
        self.btn_remove = tk.Button(self.file_btn_frame, text="Remove Selected (\u274C)", command=self.remove_files)
        self.btn_remove.pack(side=tk.LEFT, padx=5)
        
        # --- Copy Button ---
        self.btn_copy = tk.Button(root, text="Copy to Clipboard", command=self.copy_context, font=("TkDefaultFont", 10, "bold"))
        self.btn_copy.pack(pady=10)
        
    def _save_current_files(self):
        files = list(self.file_listbox.get(0, tk.END))
        save_files(files)

    def select_files(self):
        files = filedialog.askopenfilenames(title="Select files")
        if files:
            current_files = set(self.file_listbox.get(0, tk.END))
            for f in files:
                if f not in current_files:
                    self.file_listbox.insert(tk.END, f)
                    current_files.add(f)
            self._save_current_files()
            
    def remove_files(self):
        selected_indices = self.file_listbox.curselection()
        for index in reversed(selected_indices):
            self.file_listbox.delete(index)
        self._save_current_files()
        
    def copy_context(self):
        files = list(self.file_listbox.get(0, tk.END))
        if not files:
            messagebox.showwarning("Warning", "No file paths found.")
            return
            
        result = process_files(files)
        
        if not result.strip():
            messagebox.showwarning("Warning", "No valid files could be read.")
            return
            
        self.root.clipboard_clear()
        self.root.clipboard_append(result)
        self.root.update()
        messagebox.showinfo("Success", "Copied all file contents to clipboard!")

if __name__ == "__main__":
    root = tk.Tk()
    root.geometry("600x400")
    app = FileConcatApp(root)
    root.mainloop()
