using HotChocolate;
using HotChocolate.Types;
using SSI360V2.Core.DTOs;
using SSI360V2.Core.Interfaces;

namespace SSI360V2.API.GraphQL.Mutations;

[ExtendObjectType("Mutation")]
public class TenantMutations
{
    public async Task<TenantDto> CreateTenant(
        [Service] ITenantService tenantService,
        CreateTenantDto createTenantDto)
    {
        return await tenantService.CreateTenantAsync(createTenantDto);
    }

    public async Task<TenantDto> UpdateTenant(
        [Service] ITenantService tenantService,
        Guid id,
        UpdateTenantDto updateTenantDto)
    {
        return await tenantService.UpdateTenantAsync(id, updateTenantDto);
    }

    public async Task<bool> DeleteTenant(
        [Service] ITenantService tenantService,
        Guid id)
    {
        await tenantService.DeleteTenantAsync(id);
        return true;
    }
}
