import React, { useContext, useState } from "react";
// import { exportComponentAsPNG } from "react-component-export-image";
import "./CoverImage.css";
import { ImgContext } from "../utils/ImgContext";
import unsplash from "../utils/unsplashConfig";
import domtoimage from "dom-to-image";

const ComponentToImg = (props) => {

	const [loading, setLoading] = useState(false)

	const { unsplashImage } = useContext(ImgContext);
	const componentRef = React.createRef();

	async function saveImage(data) {
		try {
			var a = document.createElement("A");
			a.href = data;
			a.download = `cover.png`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		} catch (error) {
			console.error('保存图片失败:', error);
			alert('下载失败，请重试');
		} finally {
			setLoading(false);
		}
	}

	const downloadImage = async () => {
		try {
			setLoading(true);

			const element = componentRef.current;
			
			if (!element) {
				throw new Error('无法找到要下载的元素');
			}

			// 等待所有图片加载完成
			const images = element.querySelectorAll('img');
			await Promise.all(Array.from(images).map(img => {
				if (img.complete) return Promise.resolve();
				return new Promise((resolve, reject) => {
					img.onload = resolve;
					img.onerror = () => {
						console.warn('图片加载失败:', img.src);
						resolve(); // 即使图片加载失败也继续
					};
					// 设置超时
					setTimeout(resolve, 5000);
				});
			}));

			// 简化配置，只使用基本选项
			const data = await domtoimage.toPng(componentRef.current, {
				height: element.offsetHeight * 2,
				width: element.offsetWidth * 2,
				style: {
					transform: "scale(" + 2 + ")",
					transformOrigin: "top left",
					width: element.offsetWidth + "px",
					height: element.offsetHeight + "px",
				}
			});

			await saveImage(data);

			// 跟踪 Unsplash 下载
			if (unsplashImage && unsplashImage.downloadLink) {
				try {
					await unsplash.photos.trackDownload({ 
						downloadLocation: unsplashImage.downloadLink 
					});
				} catch (trackError) {
					console.warn('跟踪下载失败:', trackError);
					// 不影响主要功能，只是记录警告
				}
			}

		} catch (error) {
			console.error('下载图片时出错:', error);
			setLoading(false);
			
			// 提供更友好的错误信息
			if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
				alert('图片下载失败：跨域访问被阻止。请尝试刷新页面后重新选择图片。');
			} else if (error.message.includes('网络')) {
				alert('图片下载失败：网络连接问题。请检查网络连接后重试。');
			} else {
				alert('图片下载失败，请重试。如果问题持续存在，请尝试选择其他图片。');
			}
		}
	}

	return (
		<React.Fragment>
			<div ref={componentRef}>{props.children}</div>
			<button
				className="border p-2 bg-gray-700 hover:bg-gray-800 flex items-center text-white text-xl rounded-lg m-4 px-4"
				onClick={() => downloadImage()}
				disabled={loading}>

				<span>
					{
						loading ?
							<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white animate-spin" fill="currentColor" width="24" height="24" viewBox="0 0 24 24" ><path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"></path></svg>
							:
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
					}
				</span>

				<span className="mx-2">{loading ? '下载中...' : '下载'}</span>
			</button>
		</React.Fragment>
	);

}

export default ComponentToImg;
