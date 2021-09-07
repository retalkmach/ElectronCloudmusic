import { createStore } from 'vuex';
export default createStore({
    state: {
        musicID: 488388943,
        playlist: [{
            id: 488388943,
            name: '光',
            artist: ['當山みれい'],
        }],
        playlistCursor: 0,
        currentTime: 0,
        playerMode: 'normal',
        setting: {},
        audioContext: AudioContext,
        audioSource: MediaElementAudioSourceNode,
        initedAudioContext: false,
        musicAnalyser: AnalyserNode,
        defaultSetting: {
            version: 9,
            advanced: {
                useNativeRange: false,
            },
            appearance: {
                autoToogleDarkMode: true,
            },
            developer: {
                performanceMonitor: false,
            },
            usePicAsPlayerBackground: true,
            carouselAnimateType: 'traditional',
            showFrequency: false,
            showTranslatedLyric: true,
            feedback: true,
            autoSign: true,
            playBitrate: '999000'
        },
    },
    mutations: {
        changeMusicID(state, id) {
            state.musicID = id;
        },
        addPlaylist(state, songData) {
            for (let i = 0; i < state.playlist.length; i += 1) {
                if (songData.id == state.playlist[i].id) {
                    return;
                }
            }
            state.playlist.splice(state.playlistCursor + 1, 0, songData);
        },
        changePlaylistCursor(state, cursor) {
            console.log("cursor is " + cursor);
            if (cursor >= state.playlist.length) {
                console.log("cursor is faild");
                return false;
            }
            state.playlistCursor = cursor;
            state.musicID = state.playlist[cursor].id;
        },
        replacePlaylist(state, newData) {
            state.playlist = newData.playlist;
            state.playlistCursor = newData.cursor;
            state.musicID = state.playlist[newData.cursor].id;
        },
        removeMusicFromPlaylist(state, cursor) {
            //当删除的是当前播放的歌曲，下面的会补上来，无需考虑下标的变化，需要切歌
            if (cursor == state.playlistCursor) {
                state.musicID = state.playlist[state.playlistCursor].id;
            } else {
                //当删除的歌曲不是当前正在播放的，只需改变下标
                //如果删除的歌曲在当前播放歌曲的前面，由于前面的少了一个，下面的会补上去，游标减1
                if (cursor < state.playlistCursor) {
                    state.playlistCursor--;
                }
            }
            state.playlist.splice(cursor, 1);
        },
        switchPlayerMode(state, mode) {
            //检查传入的类型是否正确
            let type = ['normal', 'fm'];
            if (type.some((type) => { return type === mode; })) {
                state.playerMode = mode;
            } else {
                state.playerMode = "normal";
            }
        },
        changeSetting(state, newSetting) {
            state.setting = newSetting;
        },
        initSetting(state) {
            state.setting = state.defaultSetting;
            localStorage.setItem('setting', JSON.stringify(state.defaultSetting));
        },
        upgradeSetting(state) {
            const olderSetting = JSON.parse(localStorage.getItem('setting') || '');
            const mergedSetting = {...state.defaultSetting, ...olderSetting };
            mergedSetting.version = state.defaultSetting.version;
            state.setting = mergedSetting;
            localStorage.setItem('setting', JSON.stringify(mergedSetting));
        },
    },
    actions: {},
    modules: {},
});
//# sourceMappingURL=index.js.map