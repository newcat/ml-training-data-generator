export interface ICalculationWorkerMessage {
    editorState: string;
    seed: string;
    startIndex: number;
    endIndex: number;
}

export interface IPreparationData {
    seed: string;
}