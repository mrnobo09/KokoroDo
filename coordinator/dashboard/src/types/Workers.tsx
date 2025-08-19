// This file is used to define the types for worker and workers in the application


export type Worker = {
        host_name : string;
        ip_address : string;
    }

export type Workers = Record<string,Worker>;