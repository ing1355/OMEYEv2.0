import CryptoJS from "crypto-js";
import { SavedJSONType, SiteDataType } from "../Constants/GlobalTypes";
import { ReIDRequestGroupDataType } from "../Model/ReIDLogModel";
import { ConditionDataSingleType } from "../Model/ConditionDataModel";
import { ConditionDataTargetSelectMethodTypeKeys, ConditionDataTargetSelectMethodTypes } from "../Components/ReID/Condition/Constants/Params";
import { toPng } from "html-to-image";

export function ArrayDeduplication<T>(array: Array<T>, func?: (data1: T, data2: T) => boolean) {
    return array.filter((v, i) => (func ? array.findIndex(_ => func(v, _)) : array.indexOf(v)) === i)
}

export async function multipleFileUploadFunction(files: File[] | FileList) {
    let result: {
        width: number,
        height: number,
        src: string
    }[] = [];
    for (var i = 0; i < files.length; i++) {
        result.push(await FileToBase64Image(files[i]));
    }
    return result;
}

const FileToBase64Image = (file: File): Promise<{
    width: number,
    height: number,
    src: string
}> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {

                resolve({
                    width: img.width,
                    height: img.height,
                    src: reader.result as string
                })
            }
            img.src = reader.result as string
        };
        reader.onerror = error => reject(error);
    })
}

export function encrypt(text: string, SECRET_KEY: string) {
    if (typeof text !== "string") {
        return CryptoJS.AES.encrypt(String(text), SECRET_KEY).toString();
    }
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

function makeTreeData(siteData: SiteDataType[], depth: number, pre_siteName: string): (SiteDataType & {
    fullName: string
})[] {
    const splitedPreSiteName = pre_siteName.split('/')
    const notOverlapNames = ArrayDeduplication(siteData.map(sData => sData.siteName.split('/')[depth])).map(name => name || splitedPreSiteName[depth - 1]); // 상위 뎁스 siteName을 제외한 siteName들
    if (notOverlapNames.length === siteData.length) { // 전체 사이트 데이터 중 해당 현재 뎁스 데이터가 전체 사이트 데이터랑 동일한 경우
        return siteData.map(sData => {
            const splitedName = sData.siteName.split('/'); // 현재 뎁스, 해당 사이트 뎁스로 자름
            if (splitedName[depth + 1]) {
                return {
                    ...sData,
                    siteName: splitedName[depth],
                    sites: makeTreeData([sData], depth + 1, (pre_siteName ? pre_siteName + '/' + splitedName[depth] : splitedName[depth])),
                    fullName: splitedName.slice(0, depth + 1).join('/')
                }
            } else { // 마지막 뎁스인 경우
                return {
                    ...sData,
                    siteName: splitedName[depth] || splitedName[splitedName.length - 1],
                    fullName: sData.siteName === pre_siteName ? pre_siteName + '/' + sData.siteName : sData.siteName
                }
            }
        });
    } else { // 현재 타겟 데이터가 현재 뎁스 데이터보다 더 많이 존재하는 경우
        return notOverlapNames.map(siteName => { // 현재 뎁스 사이트명으로 순회
            const fullName = pre_siteName + '/' + siteName; // 현재 뎁스 FullName
            const targets = siteData.filter(sData => sData.siteName.slice(0, fullName.length) === fullName); // 현재 뎁스의 하위 사이트 데이터 추출
            if (!targets.length) {
                return {
                    ...targets[0],
                    siteName,
                    fullName,
                    ...siteData.find(sData => sData.siteName === siteName)
                }
            } else {
                return {
                    ...targets[0],
                    siteName,
                    sites: makeTreeData(targets.slice(1,), depth + 1, (pre_siteName ? pre_siteName + '/' + siteName : siteName)),
                    fullName,
                    cameras: targets[0].cameras || []
                }
            }
        })
    }
}

export function MakeVMSCameraSitesForTreeView(sitesData: SiteDataType[]): SiteDataType[] {
    return ArrayDeduplication(sitesData.map(siteData => siteData.siteName.split('/')[0])).map(siteName => sitesData.filter(sData => sData.siteName.split('/')[0] === siteName))
        .map(siteData => { // VMS 타입 필터링 후 최상위 뎁스로 구분하여 map
            if (!siteData.find(sData => sData.siteName.includes('/'))) { // 최상위 뎁스 이후 사이트가 한개인 경우
                return {
                    ...siteData[0],
                    fullName: siteData[0].siteName
                }
            } else { // 최상위 뎁스 이후 사이트가 여러개인 경우
                const firstSiteName = siteData[0].siteName.split('/')[0]
                return {
                    ...siteData[0],
                    siteName: firstSiteName,
                    fullName: firstSiteName,
                    sites: makeTreeData(siteData.slice(1,), 1, firstSiteName)
                }
            }
        })
}

export function VMSTest(sitesData: SiteDataType[]): SiteDataType[] {
    let temp: SiteDataType[] = []
    const firstDepthSites = sitesData.filter(_ => !_.siteName.includes('/'))
    firstDepthSites.forEach(_ => {
        temp.push(_)
    })
    const hasDepthSites = sitesData.filter(_ => _.siteName.includes('/'))
    hasDepthSites.forEach(_ => {
        const target = temp.find(__ => __.siteName === _.siteName.split('/')[0])
        if (target && !target?.sites) target.sites = []

    })
    return firstDepthSites
}

export const ConvertWebImageSrcToServerBase64ImageSrc = (src: string): string => {
    return src.substring(src.indexOf(",") + 1)
}

export async function ReIDLogDataSaveToJSON(data: ReIDRequestGroupDataType) {
    let _: ConditionDataSingleType = {
        name: data.title,
        etc: data.etc,
        rank: data.rank,
        cctv: data.cameraGroups.map(_ => ({
            selected: false,
            cctvList: _
        })),
        time: data.timeGroups.map(_ => ({
            selected: false,
            time: [_.startTime, _.endTime]
        })),
        targets: data.targetObjects.map(_ => ({
            id: 0,
            objectId: _.id,
            type: _.type,
            src: _.imgUrl,
            method: 'JSONUPLOAD',
            ocr: _.ocr
        })),
        isRealTime: false
    }
    DownloadSingleConditionJsonData(_)
}

export function UploadSingleConditionJsonData(callback?: (jsonData: ConditionDataSingleType) => void, errCallback?: (error: unknown) => void) {
    const upload = document.createElement('input')
    upload.type = "file"
    upload.accept = ".json"
    upload.hidden = true
    upload.onchange = (e) => {
        const file = (e.currentTarget as HTMLInputElement)?.files?.[0];
        if (file) {
            const reader = new FileReader()
            reader.onload = (event: ProgressEvent<FileReader>) => {
                try {
                    const fileContent = event.target?.result as string
                    const jsonData = JSON.parse(fileContent)
                    if (callback) callback(jsonData)
                } catch (err) {
                    console.error('upload error ! : ', err)
                    if(errCallback) errCallback(err)
                } finally {
                    document.body.removeChild(upload)
                }
            }
            reader.readAsText(file)
        }
    }
    document.body.appendChild(upload)
    upload.click()
}

export function DownloadSingleConditionJsonData(data: ConditionDataSingleType) {
    let output = JSON.stringify(data, null, 4);
    const blob = new Blob([output]);
    const fileDownlaoadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = fileDownlaoadUrl;
    downloadLink.download = convertFullTimeString(new Date()) + '.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(fileDownlaoadUrl);
}

export function DownloadMultiConditionJsonData(data: SavedJSONType) {
    let output = JSON.stringify(data, null, 4);
    const blob = new Blob([output]);
    const fileDownlaoadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.target = "_self";
    downloadLink.href = fileDownlaoadUrl;
    downloadLink.download = convertFullTimeString(new Date()) + '.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(fileDownlaoadUrl);
}

export function AddZeroFunc(num: number | string) {
    let temp = num as number
    if (typeof num === 'string') {
        temp = parseInt(num)
    }
    if (temp < 10) {
        return '0' + temp;
    } else {
        return temp;
    }
}

export function convertFullTimeString(now: Date) {
    return '' + now.getFullYear() + AddZeroFunc(now.getMonth() + 1) + AddZeroFunc(now.getDate()) +
        AddZeroFunc(now.getHours()) + AddZeroFunc(now.getMinutes()) + AddZeroFunc(now.getSeconds())
}

export function convertFullDatestring(now: Date) {
    return '' + now.getFullYear() + AddZeroFunc(now.getMonth() + 1) + AddZeroFunc(now.getDate())
}

export const convertFullTimeStringToHumanTimeFormat = (time: string, separatorStr?: string) => {
    if(!time) return ""
    const year = time.slice(0, 4)
    const month = time.slice(4, 6)
    const day = time.slice(6, 8)
    const hour = time.slice(8, 10)
    const minute = time.slice(10, 12)
    const second = time.slice(12,)
    const separator = separatorStr ? ` ${separatorStr} ` : ' '
    return `${year}-${month}-${day}${separator}${hour}:${minute}:${second}`
}

export const convertFullTimeStringToHumanTimeFormatByDate = (date: Date) => {
    return convertFullTimeStringToHumanTimeFormat(convertFullTimeString(date))
}

export function getTimeDifference(startTime: string, endTime: string): string {
    const start = new Date(convertFullTimeStringToHumanTimeFormat(startTime));
    const end = new Date(convertFullTimeStringToHumanTimeFormat(endTime));
    const timeDiff = Math.abs(end.getTime() - start.getTime());

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    let _ = ''
    if (hours) _ += `${hours}시간 `
    if (minutes) _ += `${minutes}분 `
    if (seconds) _ += `${seconds}초`

    return _;
}

export const GetCoordByUrl = (url: string): Array<any> => {
    return url.match(/_\d{1,4}_\d{1,4}_\d{1,4}_\d{1,4}/g)![0].slice(1,).split('_') || []
}

export function getColorByScore(score: number) {
    let score_ = (typeof score !== 'number' ? score * 1 : score);
    if (score_ >= 90) {
        return '#19d600';
    } else if (score_ >= 70) {
        return '#0090ff';
    } else if (score_ >= 50) {
        return '#ff2323';
    } else {
        return '#aaa';
    }
}

export function distanceDaysTwoDate(d1: Date, d2: Date) {
    return Math.abs(d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24)
}

export const getMethodNameByKey = (key: ConditionDataTargetSelectMethodTypeKeys) => {
    switch (key) {
        case ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['CCTV']]:
            return 'CCTV 영상'
        case ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['IMAGEUPLOAD']]:
            return '이미지 업로드'
        case ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['DESCRIPTION']]:
            return '인상착의'
        case ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['REIDRESULT']]:
            return '분석 결과'
        case ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['JSONUPLOAD']]:
            return 'JSON 업로드'
        default: return '알 수 없음';
    }
}

export const FileDownloadByUrl = (url: string, fileName?: string) => {
    const aTag = document.createElement("a");
    aTag.target = "_self"
    aTag.href = url
    aTag.download = fileName || "";
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
}

export const DivToImg = async (div: HTMLDivElement) => {
    return toPng(div)
}

export const getLoadingTimeString = (time: number) => {
    const hour = Math.floor(time / 3600)
    const minute = Math.floor(time / 60) % 60
    const second = time % 60
    let str = ""
    if (hour) str += `${hour}시간 `
    if (minute) str += `${minute}분 `
    str += `${second}초 경과`
    return str
}