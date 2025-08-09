using HotChocolate;
using HotChocolate.Types;
using SSI360V2.Core.DTOs;
using SSI360V2.Core.Interfaces;

namespace SSI360V2.API.GraphQL.Mutations;

[ExtendObjectType("Mutation")]
public class UserMutations
{
    public async Task<UserDto> CreateUser(
        [Service] IUserService userService,
        CreateUserDto createUserDto)
    {
        return await userService.CreateUserAsync(createUserDto);
    }

    public async Task<UserDto> UpdateUser(
        [Service] IUserService userService,
        Guid id,
        UpdateUserDto updateUserDto)
    {
        return await userService.UpdateUserAsync(id, updateUserDto);
    }

    public async Task<bool> DeleteUser(
        [Service] IUserService userService,
        Guid id)
    {
        await userService.DeleteUserAsync(id);
        return true;
    }

    public async Task<bool> ChangePassword(
        [Service] IUserService userService,
        Guid userId,
        string currentPassword,
        string newPassword)
    {
        return await userService.ChangePasswordAsync(userId, currentPassword, newPassword);
    }
}
