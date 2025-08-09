using HotChocolate;
using HotChocolate.Types;
using SSI360V2.Core.DTOs;
using SSI360V2.Core.Interfaces;

namespace SSI360V2.API.GraphQL.Queries;

[ExtendObjectType("Query")]
public class RoleQueries
{
    public async Task<PaginatedResult<RoleDto>> GetRoles(
        [Service] IRoleService roleService,
        int page = 1,
        int pageSize = 10,
        string? searchTerm = null,
        string? sortBy = null,
        string? sortOrder = null)
    {
        return await roleService.GetRolesAsync(page, pageSize, searchTerm);
    }

    public async Task<RoleDto> GetRole(
        [Service] IRoleService roleService,
        Guid id)
    {
        return await roleService.GetRoleByIdAsync(id);
    }
}
