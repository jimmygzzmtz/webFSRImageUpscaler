import {
    html,
    render,
    useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import { upscaleDataURL } from "./WebFSR.js"

var fileType = "";
var fileName = "";

function App(props) {
    const [showingUpscaled, setShowingUpscaled] = useState(false);
    const [showingOriginal, setShowingOriginal] = useState(false);
    const [originalImageSrc, setOriginalImageSrc] = useState("");
    const [upscaledImageSrc, setUpscaledImageSrc] = useState("");

    const toDataURL = (imgId) => {
        const image = document.getElementById(imgId);
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext('2d').drawImage(image, 0, 0);
        const dataURL = canvas.toDataURL(fileType);
        return dataURL;
    };

    async function upscaleImage() {
        const upscaledImageDataURL = await upscaleDataURL(toDataURL('originalImage'), fileType);
        setUpscaledImageSrc(upscaledImageDataURL);
        setShowingUpscaled(true);
    }

    function downloadUpscaledImage() {
        downloadDataURL(toDataURL('upscaledImage'), fileName + "_upscaled");
    }

    function downloadDataURL(dataurl, filename) {
        const link = document.createElement("a");
        link.href = dataurl;
        link.download = filename;
        link.click();
    }

    function clickLoadButton() {
        document.getElementById('imageInput').click();
    }

    function loadImageFile() {
        const file = document.getElementById('imageInput').files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setOriginalImageSrc(reader.result);
            setShowingOriginal(true);
            setShowingUpscaled(false);
        }, false);

        if (file) {
            reader.readAsDataURL(file);
            fileType = file.type;
            fileName = file.name.substring(0, file.name.indexOf('.'));
        }
    }

    return html`
            <div class="app">
                <ion-app>
                    <ion-header translucent="{true}" mode="ios">
                        <ion-toolbar>
                            <ion-title>FSR Web Upscaler</ion-title>
                        </ion-toolbar>
                    </ion-header>
            
                    <ion-content fullscreen="true">
                        <ion-grid>
                            <ion-row class="centerButton">
                                <ion-col size="12" size-sm>
                                    ${showingOriginal && html`
                                    <ion-card mode="ios">
                                        <img src=${originalImageSrc} id="originalImage" />
                                        <ion-card-header>
                                            <ion-card-title>Original Image</ion-card-title>
                                        </ion-card-header>
                                    </ion-card>
                                    `}
                                </ion-col>
                                <ion-col size="12" size-sm>
                                    ${showingUpscaled && html`
                                    <ion-card mode="ios">
                                        <img src=${upscaledImageSrc} id="upscaledImage" />
                                        <ion-card-header>
                                            <ion-card-title>Upscaled Image</ion-card-title>
                                        </ion-card-header>
                                    </ion-card>
                                    `}
                                </ion-col>
                            </ion-row>
                            <ion-row class="centerButton">
                                <ion-col size="12" size-xs>
                                    <ion-button onClick=${async () => clickLoadButton()} mode="ios">Load Image</ion-button>
                                    <input type="file" onChange="${() => loadImageFile()}" id="imageInput" style="display: none;"
                                        accept="image/*" />
                                </ion-col>
                                <ion-col size="12" size-xs>
                                    ${showingOriginal && html`
                                    <ion-button onClick=${async () => await upscaleImage()} mode="ios">Upscale</ion-button>
                                    `}
                                </ion-col>
                                <ion-col size="12" size-xs>
                                    ${showingUpscaled && html`
                                    <ion-button onClick=${()=> downloadUpscaledImage()} mode="ios">Download Upscaled Image
                                    </ion-button>
                                    `}
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-content>
                </ion-app>
            </div>
    `;
}

render(html`<${App} />`, document.body);