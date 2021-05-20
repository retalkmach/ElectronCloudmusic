global.electron = require('electron');
import { ipcRenderer } from 'electron';
window.ipcRenderer = ipcRenderer;
// window.ipcRenderer = require('electron').ipcRenderer;
window.remote = require('electron').remote;