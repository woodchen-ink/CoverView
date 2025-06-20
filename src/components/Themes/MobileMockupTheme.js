import React, { useState, useContext } from 'react';
import { ImgContext } from '../../utils/ImgContext';
import UnsplashSearch from '../UnsplashSearch';

const MobileMockupTheme = ({ config }) => {
    const { bgColor, title, font } = config;
    const { unsplashImage, setUnsplashImage } = useContext(ImgContext);
    const [image, setImage] = useState();

    return (
        <div className={`bg-white w-full h-full`}>
            <div className={`overflow-y-hidden flex flex-row w-full h-full justify-center`}
                style={{ backgroundColor: bgColor }}
            >
                <div className="w-full h-full">
                    {unsplashImage ?
                        <div className='relative flex group h-full'>
                            <div className="h-full w-full">
                                <img src={unsplashImage.url && unsplashImage.url} className="object-cover h-full w-full" alt="preview" />
                            </div>

                            <div className="h-full bg-gray-800/60 absolute top-0 right-0 left-0 flex items-center px-10">
                                <button
                                    onClick={() => setUnsplashImage('')}
                                    className="absolute top-2 right-2 cursor-pointer">
                                    <svg className="group-hover:inline-block hidden w-8 h-8 text-gray-800 bg-white p-2 rounded-full z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>

                                <h1 className={`${font} text-2xl w-1/2 md:text-4xl px-4 text-white font-bold text-left`}>{title}</h1>

                                <div className="w-5/12 mx-auto m-4 group h-4/5 shadow-lg flex flex-col bg-white border-t-8 border-x-8 border-gray-800 rounded-t-3xl border-white">
                                    <div className="bg-gray-800 h-8 w-full p-2 pb-3 flex items-center rounded-t">
                                        <div className="flex mx-auto items-center">
                                            <div className="bg-white h-3 w-3 rounded-full mx-1"></div>
                                            <div className="bg-white h-2 w-20 rounded-full mx-1"></div>
                                        </div>
                                    </div>

                                    {image ?
                                        <div className="group relative h-full">
                                            <img src={image && image} className="object-cover rounded -translate-y-1 h-full w-full" alt="preview" />
                                            <button
                                                onClick={() => setImage('')}
                                                className="absolute top-4 right-2 cursor-pointer">
                                                <svg className="group-hover:inline-block hidden w-6 h-6 bg-gray-500 p-1 text-white rounded-full z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </div>
                                        :
                                        <div className="flex flex-col px-4 rounded-xl py-20 bg-white items-center justify-center h-full">
                                            <input type="file"
                                                className="text-sm flex flex-col cursor-pointer mb-2 bg-white rounded border"
                                                onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
                                            />
                                            <span className="text-center italic">点击上传截图</span>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="absolute bottom-4 right-4 opacity-80">
                                <div className="group-hover:flex hidden items-center">
                                    <span className="text-sm text-white mx-2">Photo by</span>
                                    <a href={unsplashImage.profile} target="_blank" rel="noreferrer" className="cursor-pointer flex items-center bg-gray-300 rounded-full text-sm">
                                        <img src={unsplashImage.avatar && unsplashImage.avatar} alt={unsplashImage.name} className="h-6 w-6 rounded-full mr-2" />
                                        <span className="pr-2">{unsplashImage.name}</span>
                                    </a>
                                    <a href="https://unsplash.com/?utm_source=https://coverview.czl.net&utm_medium=referral" className="text-sm text-white mx-2">Unsplash</a>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="flex flex-col p-2 bg-white items-center justify-center h-full">
                            <UnsplashSearch largeImgPreview />
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default MobileMockupTheme;