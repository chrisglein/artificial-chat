# Windows Native Code (`windows/`)

## Overview

This directory contains the Windows-specific native code for React Native Windows (RNW). The app is built as a C++/WinRT UWP application.

## Structure

- `artificialChat/` - Main application project
  - `*.cpp/h` - C++ source and headers
  - `*.vcxproj` - Visual Studio project files
  - `AutolinkedNativeModules.*` - Auto-generated RNW module linking
  - `pch.h/cpp` - Precompiled headers
  
- `artificialChat.Package/` - MSIX packaging project for Windows Store deployment
- `artificialChat.sln` - Visual Studio solution file

## Native Modules

The app includes custom Turbo Modules for Windows-specific features:

### VersionInfo Module
- **Spec**: `codegen/NativeVersionInfoSpec.g.h`
- **Implementation**: `windows/artificialChat/VersionInfo.h`
- **Purpose**: Exposes app version and build version to JavaScript
- **Constants**: `appVersion`, `buildVersion`

### Speech Module  
- **Spec**: `codegen/NativeSpeechSpec.g.h`
- **Implementation**: `windows/artificialChat/Speech.h`
- **Purpose**: Text-to-speech using Windows Speech Synthesis
- **Methods**: `speak()`, `getVoices()`, `setVoice()`

## Building Windows App

**Prerequisites**: Windows OS with Visual Studio and MSBuild components

```powershell
# Install RNW dependencies (run once, elevated PowerShell)
node_modules/react-native-windows/Scripts/rnw-dependencies.ps1
```

```bash
# Debug build (default)
yarn windows

# Release build
yarn windows --release

# Specify architecture
yarn windows --arch x64
yarn windows --arch x86
```

**Build times**: 5-30 minutes for first build, 2-10 minutes for incremental changes

## Modifying Native Code

### Adding New Native Module
1. Create spec file in `codegen/` directory
2. Implement module in `windows/artificialChat/`
3. Register in `AutolinkedNativeModules.g.cpp` (auto-generated)
4. Export from JavaScript in `src/Native*.ts`

### Debugging
- Open `windows/artificialChat.sln` in Visual Studio
- Set breakpoints in C++ code
- Press F5 to build and debug

### Common Issues
- **Build fails**: Ensure RNW dependencies script has been run
- **Missing MSBuild**: Install Visual Studio with C++ workload
- **Linking errors**: Clean and rebuild solution

## Platform Limitations

- Windows builds only work on Windows OS
- Linux/macOS cannot compile or run Windows native code
- JavaScript development (Metro bundler) works cross-platform
