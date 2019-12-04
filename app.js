'use strict'
const ANDROID = 'android';
const IOS = 'ios';

const ANDROID_DEVICES = [
    {
        "id":1,
        "mobDeviceModels": "LG-P705",
        "mobOsVersions": "4.0.3",
        "mobDeviceResolutions": "800 x 480"
    },
    {
        "id":2,
        "mobDeviceModels": "Asus Transformer Pad TF300T",
        "mobOsVersions": "4.1.1",
        "mobDeviceResolutions": "800 x 1280"
    },
    {
        "id":3,
        "mobDeviceModels": "Samsung S3 mini",
        "mobOsVersions": "4.1.2",
        "mobDeviceResolutions": "800 x 480"
    },
    {
        "id":4,
        "mobDeviceModels": "HTC One X",
        "mobOsVersions": "4.2.2",
        "mobDeviceResolutions": "1280 x 720"
    },
    {
        "id":5,
        "mobDeviceModels": "Nexus 5",
        "mobOsVersions": "4.4.4",
        "mobDeviceResolutions": "1920 x 1080"
    },
    {
        "id":6,
        "mobDeviceModels": "Xiaomi Redmi 3S",
        "mobOsVersions": "6.0.1",
        "mobDeviceResolutions": "1280 x 720"
    },
    {
        "id":7,
        "mobDeviceModels": "Nexus 5X",
        "mobOsVersions": "7.1.2",
        "mobDeviceResolutions": "1920 x 1080"
    },
    {
        "id":8,
        "mobDeviceModels": "Samsung S8",
        "mobOsVersions": "8",
        "mobDeviceResolutions": "2960 x 1440"
    },
    {
        "id":9,
        "mobDeviceModels": "Huawei P20 Lite",
        "mobOsVersions": "8",
        "mobDeviceResolutions": "2280 x 1080"
    },
    {
        "id":10,
        "mobDeviceModels": "Xiaomi Mi 8 Lite",
        "mobOsVersions": "8.1",
        "mobDeviceResolutions": "2280 x 1080"
    },
    {
        "id":11,
        "mobDeviceModels": "Xiaomi Mi A2",
        "mobOsVersions": "9",
        "mobDeviceResolutions": "2160 x 1080"
    }
]

const IOS_DEVICES = [
    {
        "id":1,
        "mobDeviceModels": "iPad 2 + 3G",
        "mobOsVersions": "9.3.5",
        "mobDeviceResolutions": "1024 x 768"
    },
    {
        "id":2,
        "mobDeviceModels": "iPad mini 3",
        "mobOsVersions": "11.4.1",
        "mobDeviceResolutions": "2047 x 1536"
    },
    {
        "id":3,
        "mobDeviceModels": "iPad Air 2",
        "mobOsVersions": "12.4",
        "mobDeviceResolutions": "2047 x 1536"
    },
    {
        "id":4,
        "mobDeviceModels": "iPhone 5",
        "mobOsVersions": "10.3.3",
        "mobDeviceResolutions": "1136 x 640"
    },
    {
        "id":5,
        "mobDeviceModels": "iPhone 6",
        "mobOsVersions": "12.4",
        "mobDeviceResolutions": "1334 x 750"
    },
    {
        "id":6,
        "mobDeviceModels": "iPhone 6 Plus",
        "mobOsVersions": "10.3.3",
        "mobDeviceResolutions": "1920 x 1080"
    },
    {
        "id":7,
        "mobDeviceModels": "iPhone X",
        "mobOsVersions": "13.0",
        "mobDeviceResolutions": "2436 x 1125"
    },
    {
        "id":8,
        "mobDeviceModels": "iPhone XS",
        "mobOsVersions": "13.1",
        "mobDeviceResolutions": "2436 x 1125"
    },
]

const DEVICES_LANGUAGES = [
    {"id":1,"name":"UA"},
    {"id":2,"name":"RU"},
    {"id":3,"name":"EN"}
]

var checkListId = null;
var checkListAppId = null;

const statusRegressList = document.getElementById('statusRegressList');

document.getElementById('myButton').addEventListener('click', () => {
    // chrome.tabs.executeScript({
    //     code: '(' + modifyDOM + ')();'
    // });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs[0];
        var url = new URL(tab.url)
        var id = url.pathname.split('/')[2];
        // console.log(id);
        getInfo(id)
    })
});

function getInfo(id){
    fetch('https://tm.pb.ua/functional-regress/checklist-id/' + id, {
        method: 'GET',
        credentials: 'include'
    })
        .then(resp => resp.json())
        .then(data => createNewArray(data))
}

function createNewArray(data){
    let checkIdArr = [];
    data.forEach(item => item.functionalChecks.forEach(item => checkIdArr.push(item.checkId)));
    changeStatus(checkIdArr);
}

function changeStatus(checkIdArr){
    checkIdArr.forEach(elem => 
        fetch('https://tm.pb.ua/functional-check-regress', {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache',
            credentials: 'include', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify({
                "checkId": elem,
                "resultCheck": statusRegressList.options[statusRegressList.selectedIndex].value // status 1 - new, 2 - pass, 3 - fail	
            }),
        })
        .then(response => response.json())
        .then(reloadTab)
    )
}

function reloadTab(){
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.reload(tabs[0].id);
    });
}

const getChecked = document.getElementById('chooseDeviceOs');
const devicesForm = document.getElementById('devicesForm');
const devicesList = document.getElementById('devicesList');
const languageList = document.getElementById('languageList');
const mobCountBuilds = document.getElementById('mobCountBuilds');
const devicesListTemplate = document.getElementById('devicesListTemplate').innerHTML;
const languageListTemplate = document.getElementById('languageListTemplate').innerHTML;

getChecked.addEventListener('click', showform)
devicesList.addEventListener('click', onDeviceClick)
languageList.addEventListener('click', onLanguageClick)
devicesForm.addEventListener('submit', onFormSubmit)

function showform(e){
    if(devicesForm.classList.contains('d-none')){
        devicesForm.classList.remove('d-none')
    }

    if(e.target.id == ANDROID){
        devicesList.setAttribute('versionName', ANDROID)
        showDevices(ANDROID_DEVICES)
    }
    else if(e.target.id == IOS){
        devicesList.setAttribute('versionName', IOS)
        showDevices(IOS_DEVICES)
    }

    showLanguageList(DEVICES_LANGUAGES)
}
function showLanguageList(DEVICES_LANGUAGES){
    languageList.innerHTML = '';
    DEVICES_LANGUAGES.forEach(element => {
        languageList.innerHTML += generateLanguageList(element)
    });
}

function generateLanguageList(element){
    return languageListTemplate
            .replace('{{id}}', element.id)
            .replace('{{languageName}}', element.name)
}

function showDevices(deviceOs){
    devicesList.innerHTML = "";
    deviceOs.forEach(element => {
        devicesList.innerHTML += generateDevicesList(element)
    })
}

function generateDevicesList(element){
    return devicesListTemplate
            .replace('{{id}}', element.id)
            .replace('{{deviceName}}', element.mobDeviceModels)
            .replace('{{deviceVersion}}', element.mobOsVersions)
}

function onDeviceClick(e){
    if(e.target.tagName === "LABEL"){
        return;
    }
    var targer = e.target;
    var versionName = devicesList.getAttribute('versionname')
    if(versionName == ANDROID){
        if(!ANDROID_DEVICES[targer.value - 1].checked){
            ANDROID_DEVICES[targer.value - 1].checked = true;
        } else {
            delete ANDROID_DEVICES[targer.value - 1].checked
        }
    } 
    else {
        if(!IOS_DEVICES[targer.value - 1].checked){
            IOS_DEVICES[targer.value - 1].checked = true;
        } else {
            delete IOS_DEVICES[targer.value - 1].checked
        }
    }
}

function onLanguageClick(e){
    if(e.target.tagName === "LABEL"){
        return;
    }
    var targer = e.target;
    if(!DEVICES_LANGUAGES[targer.value - 1].checked){
        DEVICES_LANGUAGES[targer.value - 1].checked = true;
    } else {
        delete DEVICES_LANGUAGES[targer.value - 1].checked
    }
}


function onFormSubmit(e){
    e.preventDefault();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs[0];
        var url = new URL(tab.url)
        checkListId = url.pathname.split('/')[2];
        // console.log(checkListId);
        getInfoAppId(checkListId)
    })
}

function checkedMobCountBuilds(){
    const checkedDevicesLang = DEVICES_LANGUAGES.filter((device)=>{
        return device.checked
    })
    var versionName = devicesList.getAttribute('versionname')
    if(versionName == ANDROID){
        const checkedAndroid = ANDROID_DEVICES.filter((device)=>{
            return device.checked
        })
        createRequestFormat(checkedAndroid, checkedDevicesLang)
    } else if(versionName == IOS){
        const checkedIos = IOS_DEVICES.filter((device)=>{
            return device.checked
        })
        createRequestFormat(checkedIos, checkedDevicesLang)
    }
}

function createRequestFormat(checkedVersionArray, checkedDevicesLang){
    const requestFormat = checkedVersionArray.reduce((acc, device)=>{
        let obj = {...acc};
        obj['mobOsVersions'] = [...obj['mobOsVersions'],device['mobOsVersions']]
        obj['mobDeviceModels'] = [...obj['mobDeviceModels'],device['mobDeviceModels']]
        obj['mobDeviceResolutions'] = [...obj['mobDeviceResolutions'],device['mobDeviceResolutions']]
        return obj;
  
    }, {
        "mobOsVersions":[],
        "mobDeviceModels":[],
        "mobDeviceResolutions":[],
        "mobLocal":[...checkedDevicesLang],
        "mobCountBuilds":`${mobCountBuilds.value}`,
    });

    // checkedDevicesLang.forEach((lang)=>{
    //     requestFormat.mobLocal.push({"id":lang.id,"name":lang.name})
    // })

    requestFormat.id = checkListId;
    requestFormat.appId = checkListAppId;
    addAndroidDevices(requestFormat)
}

function getInfoAppId(id){
    fetch('https://tm.pb.ua/checklists/id/' + id, {
        method: 'GET',
        credentials: 'include'
    })
    .then(resp => resp.json())
    .then(data => saveData(data))
}
function saveData(data){
    checkListAppId = data.appId;
    checkListId = data.id;
    checkedMobCountBuilds()
}

function addAndroidDevices(requestFormat){
    fetch('https://tm.pb.ua/checklists', {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache',
        credentials: 'include', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(
            requestFormat
        ),
    })
    .then(reloadTab)
}