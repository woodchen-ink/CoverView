import React, { useContext } from 'react';
import { ImgContext } from '../../utils/ImgContext';
import UnsplashSearch from '../UnsplashSearch';

const BasicTheme = ({ config }) => {
    const { title, bgColor, pattern, author, icon, font, customIcon } = config;
    const { unsplashImage, setUnsplashImage } = useContext(ImgContext);

    return (
        <div className="bg-white w-full h-full">
            <div className={`overflow-y-hidden flex flex-col h-full`}
                style={{ backgroundColor: bgColor }}
            >
                <div className="flex flex-row items-center bg-white justify-center h-full">
                    <div className="w-full h-full">
                        {unsplashImage ?
                            <div className='relative flex group h-full'>
                                <div className="h-full w-full">
                                    <img src={unsplashImage.url && unsplashImage.url} className="object-cover h-full w-full" alt="preview" />
                                </div>

                                <div className="h-full bg-gray-800/60 absolute top-0 right-0 left-0 flex items-center justify-center">
                                    <button
                                        onClick={() => setUnsplashImage('')}
                                        className="absolute top-2 right-2 cursor-pointer">
                                        <svg className="group-hover:inline-block hidden w-8 h-8 text-gray-800 bg-white p-2 rounded-full z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>

                                    <div className={`${font} bg-white/90 md:w-10/12 mx-auto flex flex-col py-12 px-12 rounded-xl ${pattern}`}>
                                        <div>
                                            <h1 className="text-3xl md:text-5xl text-gray-800 font-bold text-center">{title}</h1>
                                        </div>

                                        <div className="flex mx-4 mt-8 p-4 rounded-xl items-center bg-white/80">
                                            {
                                                customIcon ?
                                                    <div className="w-12 h-12">
                                                        <img src={customIcon} alt="img" className="rounded-full bg-white p-1 border-white" />
                                                    </div>
                                                    :
                                                    <div className="mr-auto ml-2 items-center justify-center flex">
                                                        <i className={`devicon-${icon.value}-plain p-4 dev-icon text-5xl`}></i>
                                                    </div>
                                            }
                                            <h2 className="text-xl ml-auto mr-2 font-semibold">{author}</h2>
                                        </div>
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
        </div>
    );
}

export default BasicTheme;