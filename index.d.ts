import "egg";

declare module "egg" {
  interface Application {
    passportGithub: Indexed;
  }
}
