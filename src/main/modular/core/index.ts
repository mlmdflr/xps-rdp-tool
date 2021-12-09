import { ipcMain } from "electron";
import { exec } from "child_process";
import global from "../general/global";
import { resolve } from "path";
import Window from "../window";

const axm = 'AxMSTSCLib.dll'
const m = 'MSTSCLib.dll'
const core = 'xrdp.exe'

export type coreClass = {
    host: string,
    username: string,
    password: string,
    fname?:string,
    opacity?: number,
    is_u_icon?: boolean
}


export const detectionIntegrity = (): boolean => {
    if (!global.getPlatformPath(axm) || !global.getPlatformPath(m) || !global.getPlatformPath(core)) {
        return false
    }
    return true
}

export const coreOn = () => {
    ipcMain.handle('xrdp-open', (event, args: coreClass) => {
        let cmd = `host=${args.host} username=${args.username} password=${args.password}`
        if (args.fname) {
            cmd += ` fname=${args.fname}`
        }
        if (args.opacity) {
            cmd += ` opacity=${args.opacity}`
        }
        if (args.is_u_icon) {
            cmd += ` is_u_icon=${args.is_u_icon}`
        }
        const c = exec(
            `${global.getPlatformPath(core)} ${cmd}`,
            {
                cwd: resolve()
            },
            (error, stdout, stderr) => {
                if (error) {
                    console.error(error);
                    Window.send('core', {
                        ok: false,
                        msg: error
                    })
                    return;
                }
                console.error(stdout);
                console.error(stderr);
                Window.send('core', {
                    ok: true,
                    msg: stdout
                })
                Window.send('core', {
                    ok: true,
                    msg: stderr
                })
            }
        );
        c.on('close', () => {
            Window.send('core', {
                ok: true,
                msg: 'close'
            })
        })
    })
}