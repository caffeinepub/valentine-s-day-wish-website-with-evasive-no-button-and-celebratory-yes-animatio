import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MemoryMetadata {
    owner: Principal;
    memoryId: bigint;
    timestamp: Time;
    caption?: string;
    photo: ExternalBlob;
    dateTaken?: Time;
}
export type Time = bigint;
export interface PersonalizedValentineGreeting {
    recipient: string;
    message: string;
}
export interface Memory {
    id: bigint;
    isPublished: boolean;
    owner: Principal;
    timestamp: Time;
    caption?: string;
    photo: ExternalBlob;
    dateTaken?: Time;
}
export interface MemoryPublic {
    id: bigint;
    isPublished: boolean;
    owner: Principal;
    timestamp: Time;
    caption?: string;
    photo: ExternalBlob;
    dateTaken?: Time;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptValentine(): Promise<void>;
    addMemory(caption: string | null, dateTaken: Time | null, photo: ExternalBlob): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMemory(id: bigint): Promise<Memory | null>;
    getPersonalizedGreeting(): Promise<PersonalizedValentineGreeting | null>;
    getPublishedMemory(id: bigint): Promise<MemoryPublic | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listMemories(): Promise<Array<Memory>>;
    listPublishedMemories(): Promise<Array<MemoryPublic>>;
    listUserPhotoMemories(): Promise<Array<MemoryMetadata>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setPersonalizedGreeting(recipient: string, message: string): Promise<void>;
    togglePublishMemory(id: bigint): Promise<void>;
}
