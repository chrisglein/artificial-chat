#include "pch.h"
#include "ReactPackageProvider.h"
#include "NativeModules.h"
#if __has_include("ReactPackageProvider.g.cpp")
#include "ReactPackageProvider.g.cpp"
#endif

using namespace winrt::Microsoft::ReactNative;

namespace winrt::artificialChat::implementation
{

void ReactPackageProvider::CreatePackage(IReactPackageBuilder const &packageBuilder) noexcept
{
    AddAttributedModules(packageBuilder, true);
}

} // namespace winrt::artificialChat::implementation
