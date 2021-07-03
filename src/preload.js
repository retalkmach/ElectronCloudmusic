import { ipcRenderer } from 'electron';

global.electron = require('electron');

window.ipcRenderer = ipcRenderer;
// window.ipcRenderer = require('electron').ipcRenderer;
window.remote = require('electron').remote;
