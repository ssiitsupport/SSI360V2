using HotChocolate;
using HotChocolate.Types;
using SSI360V2.Core.DTOs;
using SSI360V2.Core.Interfaces;

namespace SSI360V2.API.GraphQL.Queries;

[ExtendObjectType("Query")]
public class TenantQueries
{
    public async Task<PaginatedResult<TenantDto>> GetTenants(
        [Service] ITenantService tenantService,
        int page = 1,
        int pageSize = 10,
        string? searchTerm = null,
        string? sortBy = null,
        string? sortOrder = null)
    {
        return await tenantService.GetTenantsAsync(page, pageSize, searchTerm);
    }

    public async Task<TenantDto> GetTenant(
        [Service] ITenantService tenantService,
        Guid id)
    {
        return await tenantService.GetTenantByIdAsync(id);
    }

    public async Task<TenantDto> GetCurrentTenant(
        [Service] ITenantService tenantService)
    {
        return await tenantService.GetCurrentTenantAsync();
    }
}
