using HotChocolate;
using HotChocolate.Types;
using SSI360V2.Core.DTOs;
using SSI360V2.Core.Interfaces;

namespace SSI360V2.API.GraphQL.Queries;

[ExtendObjectType("Query")]
public class PermissionQueries
{
    public async Task<IEnumerable<PermissionDto>> GetPermissions(
        [Service] IPermissionRepository permissionRepository)
    {
        var permissions = await permissionRepository.GetAllAsync();
        return permissions.Select(p => new PermissionDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description
        });
    }

    public async Task<PermissionDto> GetPermission(
        [Service] IPermissionRepository permissionRepository,
        Guid id)
    {
        var permission = await permissionRepository.GetByIdAsync(id);
        if (permission == null)
        {
            throw new InvalidOperationException("Permission not found");
        }

        return new PermissionDto
        {
            Id = permission.Id,
            Name = permission.Name,
            Description = permission.Description
        };
    }
}
