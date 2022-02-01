{ pkgs ? import <nixpkgs> {
  overlays = [ 
    (self: super: {
      yarn = super.yarn.override { 
        nodejs = pkgs.nodejs-17_x;
      };
    })
   ];
} }:
  pkgs.mkShell {
    nativeBuildInputs = [ 
      pkgs.nodejs-17_x
      pkgs.yarn
    ];
}
