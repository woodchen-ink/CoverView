import React, { useContext, useState, useRef } from "react";
// import { exportComponentAsPNG } from "react-component-export-image";
import "./CoverImage.css";
import { ImgContext } from "../utils/ImgContext";
import unsplash from "../utils/unsplashConfig";
import domtoimage from "dom-to-image";

const ComponentToImg = (props) => {

	const [loading, setLoading] = useState(false)

	const { unsplashImage } = useContext(ImgContext);
	const componentRef = useRef(null);

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

			// 等待一小段时间确保组件完全渲染
			await new Promise(resolve => setTimeout(resolve, 100));

			const element = componentRef.current;
			
			if (!element) {
				throw new Error('无法找到要下载的元素，请稍后重试');
			}

			// 检查元素是否在DOM中且可见
			if (!document.body.contains(element)) {
				throw new Error('元素不在DOM中');
			}

			if (element.offsetWidth === 0 || element.offsetHeight === 0) {
				throw new Error('元素尺寸为0，请等待页面完全加载');
			}

			// 等待所有图片加载完成
			const images = element.querySelectorAll('img');
			console.log(`等待 ${images.length} 张图片加载完成...`);
			
			await Promise.all(Array.from(images).map((img, index) => {
				if (img.complete && img.naturalWidth > 0) {
					console.log(`图片 ${index + 1} 已加载`);
					return Promise.resolve();
				}
				return new Promise((resolve) => {
					const timeout = setTimeout(() => {
						console.warn(`图片 ${index + 1} 加载超时:`, img.src);
						resolve();
					}, 8000);

					img.onload = () => {
						console.log(`图片 ${index + 1} 加载完成`);
						clearTimeout(timeout);
						resolve();
					};
					
					img.onerror = () => {
						console.warn(`图片 ${index + 1} 加载失败:`, img.src);
						clearTimeout(timeout);
						resolve();
					};

					// 如果图片已经加载但事件没触发
					if (img.complete) {
						clearTimeout(timeout);
						resolve();
					}
				});
			}));

			console.log('所有图片处理完成，开始生成PNG...');

			// 再次确认元素状态
			if (!componentRef.current) {
				throw new Error('DOM元素在处理过程中丢失');
			}

			// 使用更保守的配置
			const options = {
				height: element.offsetHeight * 2,
				width: element.offsetWidth * 2,
				style: {
					transform: "scale(2)",
					transformOrigin: "top left",
					width: element.offsetWidth + "px",
					height: element.offsetHeight + "px",
				},
				// 添加过滤器，跳过可能有问题的节点
				filter: (node) => {
					// 跳过脚本标签和样式标签
					if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
						return false;
					}
					// 跳过隐藏元素
					if (node.style && node.style.display === 'none') {
						return false;
					}
					return true;
				}
			};

			const data = await domtoimage.toPng(componentRef.current, options);

			console.log('PNG生成成功');
			await saveImage(data);

			// 跟踪 Unsplash 下载
			if (unsplashImage && unsplashImage.downloadLink) {
				try {
					await unsplash.photos.trackDownload({ 
						downloadLocation: unsplashImage.downloadLink 
					});
				} catch (trackError) {
					console.warn('跟踪下载失败:', trackError);
				}
			}

		} catch (error) {
			console.error('下载图片时出错:', error);
			setLoading(false);
			
			// 提供更具体的错误信息
			let errorMessage = '图片下载失败，请重试。';
			
			if (error.message.includes('cloneNode')) {
				errorMessage = '页面还未完全加载，请等待几秒后重试。';
			} else if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
				errorMessage = '图片下载失败：跨域访问被阻止。请尝试刷新页面后重新选择图片。';
			} else if (error.message.includes('网络')) {
				errorMessage = '图片下载失败：网络连接问题。请检查网络连接后重试。';
			} else if (error.message.includes('无法找到要下载的元素')) {
				errorMessage = '页面还未准备好，请稍等片刻后重试。';
			}
			
			alert(errorMessage);
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
