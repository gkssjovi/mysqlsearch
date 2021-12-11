import tty from 'tty';

export const redirected = !tty.isatty(process.stdout.fd);
