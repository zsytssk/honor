/**  Honor中scene支持的接口 */
export interface HonorScene {
    onMounted?(...params: any[]): void;
    onResize?(width?: number, height?: number): void;
}
