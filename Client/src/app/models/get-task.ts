export interface GetTask {
    taskID: number;
    createdAt: Date;
    modifiedAt: Date;
    title: string;
    description: string;
    isCompleted: boolean;
}
