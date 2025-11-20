interface StoredFile {
  id: string;
  name: string;
  type: string;
  data: string; // Base64 data url
  timestamp: number;
}

const fileList = document.getElementById('fileList');

// Load and display files on startup
document.addEventListener('DOMContentLoaded', loadFiles);

// Storage wrapper to handle both Extension and Local Dev environments
const storage = {
  async get(key: string): Promise<any> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return await chrome.storage.local.get(key);
    } else {
      // Fallback for local dev
      const val = localStorage.getItem(key);
      return val ? { [key]: JSON.parse(val) } : {};
    }
  },
  async set(items: { [key: string]: any }): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set(items);
    } else {
      // Fallback for local dev
      Object.entries(items).forEach(([key, val]) => {
        localStorage.setItem(key, JSON.stringify(val));
      });
    }
  },
  async clear(): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.clear();
    } else {
      localStorage.clear();
    }
  }
};

// Prevent default drag behaviors on the whole document
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight body
['dragenter', 'dragover'].forEach(eventName => {
  document.body.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files on body
document.body.addEventListener('drop', handleDrop, false);

function preventDefaults(e: Event) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight() {
  document.body.classList.add('drag-over');
}

function unhighlight() {
  document.body.classList.remove('drag-over');
}

function handleDrop(e: DragEvent) {
  const dt = e.dataTransfer;
  const files = dt?.files;

  if (files) {
    handleFiles(files);
  }
}

function handleFiles(files: FileList) {
  Array.from(files).forEach(processFile);
}

function processFile(file: File) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = async () => {
    const fileData: StoredFile = {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      data: reader.result as string,
      timestamp: Date.now(),
    };

    await saveFile(fileData);
  };
}

async function saveFile(file: StoredFile) {
  const result = await storage.get('files');
  const files: StoredFile[] = (result.files as StoredFile[]) || [];
  files.push(file);

  try {
    await storage.set({ files });
    loadFiles(); // Reload list
  } catch (error) {
    console.error('Error saving file:', error);
    alert('Failed to save file. Storage quota might be exceeded.');
  }
}

async function loadFiles() {
  const result = await storage.get('files');
  const files: StoredFile[] = (result.files as StoredFile[]) || [];
  renderFiles(files);
}

function renderFiles(files: StoredFile[]) {
  if (!fileList) return;

  fileList.innerHTML = '';

  if (files.length === 0) {
    fileList.innerHTML = '<p style="text-align: center; color: #9ca3af; font-size: 0.875rem;">No files saved</p>';
    return;
  }

  files.sort((a, b) => b.timestamp - a.timestamp).forEach(file => {
    const div = document.createElement('div');
    div.className = 'file-item';

    // Simple icon based on type
    const isImage = file.type.startsWith('image/');
    const icon = isImage
      ? `<img src="${file.data}" class="file-icon" style="object-fit: cover;">`
      : `<div class="file-icon">📄</div>`;

    div.innerHTML = `
      ${icon}
      <div class="file-info">
        <div class="file-name" title="${file.name}">${file.name}</div>
        <div class="file-date">${new Date(file.timestamp).toLocaleDateString()}</div>
      </div>
      <button class="delete-btn" data-id="${file.id}" title="Delete">✕</button>
    `;

    fileList.appendChild(div);
  });

  // Add delete listeners
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = (e.target as HTMLElement).dataset.id;
      if (id) await deleteFile(id);
    });
  });
}

async function deleteFile(id: string) {
  const result = await storage.get('files');
  const files: StoredFile[] = (result.files as StoredFile[]) || [];
  const newFiles = files.filter(f => f.id !== id);
  await storage.set({ files: newFiles });
  loadFiles();
}
