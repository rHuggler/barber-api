import Bull from 'bull';

export default interface IJob {
  key: string;
  handle: (job: Bull.Job) => any;
}
