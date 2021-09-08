export type ISubtask = {
  title: string,
  completed: boolean
}

export type ITask = {
  mainTask: string,
  completed: boolean,
  editing: boolean,
  subTasks: ISubtask[],
  deadline?: string,
  price?: string
}

export type IList = {
  _id: string,
  tasks: ITask[],
  collaborators: string[],
  title: string,
  completed: boolean,
  lock: boolean,
  owner: string,
  listType: string
}
