export type LoadableDataType<T> = {
    state: 'IDLE' | 'RUNNING'
    data: T
}