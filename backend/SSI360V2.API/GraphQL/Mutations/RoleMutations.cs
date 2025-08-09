using HotChocolate;
using HotChocolate.Types;
using SSI360V2.Core.DTOs;
using SSI360V2.Core.Interfaces;

namespace SSI360V2.API.GraphQL.Mutations;

[ExtendObjectType("Mutation")]
public class RoleMutations
{
    public async Task<RoleDto> CreateRole(
        [Service] IRoleService roleService,
        CreateRoleDto createRoleDto)
    {
        return await roleService.CreateRoleAsync(createRoleDto);
    }

    public async Task<RoleDto> UpdateRole(
        [Service] IRoleService roleService,
        Guid id,
        UpdateRoleDto updateRoleDto)
    {
        return await roleService.UpdateRoleAsync(id, updateRoleDto);
    }

    public async Task<bool> DeleteRole(
        [Service] IRoleService roleService,
        Guid id)
    {
        await roleService.DeleteRoleAsync(id);
        return true;
    }
}
