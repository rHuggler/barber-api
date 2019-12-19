import Bull from 'bull';
import IJob from '../app/jobs';
import AppointmentCancelMail, { IAppointmentCancelMail } from '../app/jobs/AppointmentCancelMail';
import { bullConfig } from '../config/queue';

interface IQueue {
  [key: string]: {
    bull: Bull.Queue,
    handle: IJob['handle'],
  };
}

class Queue {
  queues: IQueue;
  jobs: IJob[];

  constructor() {
    this.queues = {};
    this.jobs = [AppointmentCancelMail];
    this.init();
  }

  async addJob(job: string, data: IAppointmentCancelMail) {
    await this.queues[job].bull.add(data);
  }

  processQueues() {
    this.jobs.forEach((job) => {
      const { bull, handle } = this.queues[job.key];

      console.log(`Inicializando fila ${job.key}`);
      bull.process(handle)
        .catch((error) => console.error(error));
    });
  }

  private init() {
    this.jobs.forEach((job) => {
      this.queues[job.key] = {
        bull: new Bull(job.key, bullConfig),
        handle: job.handle,
      };
    });
  }
}

export default new Queue();
